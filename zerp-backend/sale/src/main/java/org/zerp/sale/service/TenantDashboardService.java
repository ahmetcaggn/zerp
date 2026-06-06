package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.TableOrderStatus;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.tenantdashboard.TenantDashboardCityDistributionDTO;
import org.zerp.sale.dto.tenantdashboard.TenantDashboardMetricsDeltaDTO;
import org.zerp.sale.dto.tenantdashboard.TenantDashboardOverviewDTO;
import org.zerp.sale.dto.tenantdashboard.TenantDashboardStorePerformanceDTO;
import org.zerp.sale.dto.tenantdashboard.TenantDashboardSummaryDTO;
import org.zerp.sale.dto.tenantdashboard.TenantDashboardTrendPointDTO;
import org.zerp.sale.permission.ShopPermissionEvaluator;
import org.zerp.sale.repository.ShopRepository;
import org.zerp.sale.repository.TableOrderRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TenantDashboardService {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final int PERCENTAGE_SCALE = 2;
    private static final int CURRENCY_SCALE = 2;
    private static final int TREND_MONTHS = 6;
    private static final DateTimeFormatter TREND_LABEL_FORMATTER = DateTimeFormatter.ofPattern("MMM ''yy", Locale.forLanguageTag("tr-TR"));

    private final ShopRepository shopRepository;
    private final ShopPermissionEvaluator shopPermissionEvaluator;
    private final TableOrderRepository tableOrderRepository;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;

    @Transactional(readOnly = true)
    public TenantDashboardOverviewDTO getOverview() {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();

        Specification<Shop> tenantFilter = (root, query, cb) -> cb.equal(root.get("tenantId"), tenantId);
        List<Shop> accessibleShops = shopRepository.findAll(Specification.allOf(
                tenantFilter,
                shopPermissionEvaluator.filterReadDashboard(userId)
        ));

        ZoneId zoneId = ZoneId.systemDefault();
        LocalDateTime now = LocalDateTime.now(zoneId);

        if (accessibleShops.isEmpty()) {
            if (!shopPermissionEvaluator.canReadTenantDashboard(userId, tenantId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Dashboard");
            }
            return buildEmptyOverview(now);
        }

        List<UUID> shopIds = accessibleShops.stream().map(Shop::getId).toList();

        LocalDateTime currentMonthStart = now.toLocalDate().withDayOfMonth(1).atStartOfDay();
        Duration elapsedDuration = Duration.between(currentMonthStart, now);
        LocalDateTime previousMonthStart = currentMonthStart.minusMonths(1);
        LocalDateTime previousMonthEnd = previousMonthStart.plus(elapsedDuration);

        TableOrderRepository.DailyOrderMetricsAggregateRow currentMetrics = findTenantOrderMetrics(
                shopIds,
                tenantId,
                currentMonthStart,
                now
        );

        TableOrderRepository.DailyOrderMetricsAggregateRow previousMetrics = findTenantOrderMetrics(
                shopIds,
                tenantId,
                previousMonthStart,
                previousMonthEnd
        );

        BigDecimal currentTotalSales = defaultIfNull(currentMetrics.getDailyRevenue());
        long currentTotalOrders = defaultIfNull(currentMetrics.getPaidOrderCount());
        BigDecimal currentAverageBasket = calculateAverageCheck(currentTotalSales, currentTotalOrders);

        BigDecimal previousTotalSales = defaultIfNull(previousMetrics.getDailyRevenue());
        long previousTotalOrders = defaultIfNull(previousMetrics.getPaidOrderCount());
        BigDecimal previousAverageBasket = calculateAverageCheck(previousTotalSales, previousTotalOrders);

        List<TenantDashboardTrendPointDTO> trend = buildTrend(shopIds, tenantId, now.toLocalDate());
        List<TenantDashboardCityDistributionDTO> cityDistribution = buildCityDistribution(accessibleShops);
        List<TenantDashboardStorePerformanceDTO> storePerformance = buildStorePerformance(
                shopIds,
                tenantId,
                currentMonthStart,
                now
        );
        TenantDashboardSummaryDTO summary = buildSummary(
                shopIds,
                tenantId,
                currentMonthStart,
                now,
                currentTotalSales,
                currentTotalOrders,
                currentAverageBasket,
                storePerformance
        );

        TenantDashboardMetricsDeltaDTO metricsDelta = new TenantDashboardMetricsDeltaDTO();
        metricsDelta.setTotalSalesDeltaPercentage(calculateDeltaPercentage(currentTotalSales, previousTotalSales));
        metricsDelta.setAverageBasketDeltaPercentage(calculateDeltaPercentage(currentAverageBasket, previousAverageBasket));
        metricsDelta.setTotalOrdersDeltaPercentage(
                calculateDeltaPercentage(BigDecimal.valueOf(currentTotalOrders), BigDecimal.valueOf(previousTotalOrders))
        );

        TenantDashboardOverviewDTO overview = new TenantDashboardOverviewDTO();
        overview.setTotalSales(currentTotalSales);
        overview.setAverageBasket(currentAverageBasket);
        overview.setTotalOrders(currentTotalOrders);
        overview.setTotalStores(accessibleShops.size());
        overview.setMetricsDelta(metricsDelta);
        overview.setTrend(trend);
        overview.setCityDistribution(cityDistribution);
        overview.setStorePerformance(storePerformance);
        overview.setSummary(summary);
        overview.setLastUpdatedAt(now);

        return overview;
    }

    private TenantDashboardOverviewDTO buildEmptyOverview(LocalDateTime now) {
        TenantDashboardMetricsDeltaDTO metricsDelta = new TenantDashboardMetricsDeltaDTO();

        TenantDashboardSummaryDTO summary = new TenantDashboardSummaryDTO();
        summary.setTotalSales(BigDecimal.ZERO);
        summary.setTotalOrders(0L);
        summary.setAverageOrderValue(BigDecimal.ZERO.setScale(CURRENCY_SCALE, RoundingMode.HALF_UP));

        TenantDashboardOverviewDTO overview = new TenantDashboardOverviewDTO();
        overview.setTotalSales(BigDecimal.ZERO);
        overview.setAverageBasket(BigDecimal.ZERO.setScale(CURRENCY_SCALE, RoundingMode.HALF_UP));
        overview.setTotalOrders(0L);
        overview.setTotalStores(0L);
        overview.setMetricsDelta(metricsDelta);
        overview.setTrend(new ArrayList<>());
        overview.setCityDistribution(new ArrayList<>());
        overview.setStorePerformance(new ArrayList<>());
        overview.setSummary(summary);
        overview.setLastUpdatedAt(now);
        return overview;
    }

    private List<TenantDashboardTrendPointDTO> buildTrend(List<UUID> shopIds, UUID tenantId, LocalDate today) {
        List<TenantDashboardTrendPointDTO> trend = new ArrayList<>(TREND_MONTHS);
        LocalDate startMonth = today.withDayOfMonth(1).minusMonths(TREND_MONTHS - 1L);
        LocalDateTime now = LocalDateTime.now();

        for (int offset = 0; offset < TREND_MONTHS; offset++) {
            LocalDate month = startMonth.plusMonths(offset);
            LocalDateTime monthStart = month.atStartOfDay();
            LocalDateTime monthEnd = monthStart.plusMonths(1);
            LocalDateTime boundedEnd = monthEnd.isAfter(now) ? now : monthEnd;

            TableOrderRepository.DailyOrderMetricsAggregateRow metrics = monthStart.isBefore(boundedEnd)
                    ? findTenantOrderMetrics(shopIds, tenantId, monthStart, boundedEnd)
                    : new EmptyDailyOrderMetricsAggregateRow();

            TenantDashboardTrendPointDTO point = new TenantDashboardTrendPointDTO();
            point.setLabel(month.format(TREND_LABEL_FORMATTER));
            point.setSales(defaultIfNull(metrics.getDailyRevenue()));
            point.setOrders(defaultIfNull(metrics.getPaidOrderCount()));
            trend.add(point);
        }

        return trend;
    }

    private List<TenantDashboardCityDistributionDTO> buildCityDistribution(List<Shop> shops) {
        if (shops.isEmpty()) {
            return List.of();
        }

        Map<String, Long> cityCounts = new LinkedHashMap<>();
        for (Shop shop : shops) {
            String city = normalizeCity(shop.getCity());
            cityCounts.put(city, cityCounts.getOrDefault(city, 0L) + 1L);
        }

        long totalCount = shops.size();
        return cityCounts.entrySet().stream()
                .map(entry -> {
                    TenantDashboardCityDistributionDTO dto = new TenantDashboardCityDistributionDTO();
                    dto.setCity(entry.getKey());
                    dto.setStoreCount(entry.getValue());
                    dto.setPercentage(
                            BigDecimal.valueOf(entry.getValue())
                                    .multiply(HUNDRED)
                                    .divide(BigDecimal.valueOf(totalCount), PERCENTAGE_SCALE, RoundingMode.HALF_UP)
                    );
                    return dto;
                })
                .sorted(Comparator.comparing(TenantDashboardCityDistributionDTO::getStoreCount).reversed())
                .toList();
    }

    private List<TenantDashboardStorePerformanceDTO> buildStorePerformance(
            List<UUID> shopIds,
            UUID tenantId,
            LocalDateTime start,
            LocalDateTime end
    ) {
        return tableOrderRepository.findStorePerformanceForTenantDashboard(
                        shopIds,
                        tenantId,
                        TableOrderStatus.PAID,
                        start,
                        end
                )
                .stream()
                .map(row -> {
                    TenantDashboardStorePerformanceDTO dto = new TenantDashboardStorePerformanceDTO();
                    dto.setStoreId(row.getShopId());
                    dto.setStoreName(row.getShopName());
                    dto.setSales(defaultIfNull(row.getSales()));
                    dto.setOrderCount(defaultIfNull(row.getOrderCount()));
                    return dto;
                })
                .toList();
    }

    private TenantDashboardSummaryDTO buildSummary(
            List<UUID> shopIds,
            UUID tenantId,
            LocalDateTime start,
            LocalDateTime end,
            BigDecimal totalSales,
            long totalOrders,
            BigDecimal averageOrderValue,
            List<TenantDashboardStorePerformanceDTO> storePerformance
    ) {
        TenantDashboardSummaryDTO summary = new TenantDashboardSummaryDTO();
        summary.setTotalSales(totalSales);
        summary.setTotalOrders(totalOrders);
        summary.setAverageOrderValue(averageOrderValue);

        List<TableOrderRepository.TopProductSummaryAggregateRow> topProducts = tableOrderRepository
                .findTopProductsForTenantDashboard(
                        shopIds,
                        tenantId,
                        TableOrderStatus.PAID,
                        start,
                        end
                );

        if (!topProducts.isEmpty()) {
            summary.setTopProductName(topProducts.get(0).getMenuItemName());
        }

        if (!storePerformance.isEmpty()) {
            summary.setTopStoreName(storePerformance.get(0).getStoreName());
        }

        return summary;
    }

    private TableOrderRepository.DailyOrderMetricsAggregateRow findTenantOrderMetrics(
            List<UUID> shopIds,
            UUID tenantId,
            LocalDateTime start,
            LocalDateTime end
    ) {
        TableOrderRepository.DailyOrderMetricsAggregateRow row = tableOrderRepository.findTenantDailyOrderMetricsForDashboard(
                shopIds,
                tenantId,
                TableOrderStatus.PAID,
                start,
                end
        );

        return row == null ? new EmptyDailyOrderMetricsAggregateRow() : row;
    }

    private BigDecimal defaultIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private long defaultIfNull(Long value) {
        return value == null ? 0L : value;
    }

    private BigDecimal calculateAverageCheck(BigDecimal revenue, long paidOrderCount) {
        if (paidOrderCount <= 0L) {
            return BigDecimal.ZERO.setScale(CURRENCY_SCALE, RoundingMode.HALF_UP);
        }

        return revenue.divide(BigDecimal.valueOf(paidOrderCount), CURRENCY_SCALE, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateDeltaPercentage(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }

        return current
                .subtract(previous)
                .multiply(HUNDRED)
                .divide(previous.abs(), PERCENTAGE_SCALE, RoundingMode.HALF_UP);
    }

    private String normalizeCity(String city) {
        if (city == null || city.isBlank()) {
            return "Diğer";
        }

        return city.trim();
    }

    private static class EmptyDailyOrderMetricsAggregateRow implements TableOrderRepository.DailyOrderMetricsAggregateRow {

        @Override
        public BigDecimal getDailyRevenue() {
            return BigDecimal.ZERO;
        }

        @Override
        public Long getPaidOrderCount() {
            return 0L;
        }
    }
}
