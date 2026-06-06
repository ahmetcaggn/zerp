package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.common.entity.sale.ShopTableStatus;
import org.zerp.common.entity.sale.TableOrderStatus;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.shopdashboard.ShopDashboardCategorySalesDTO;
import org.zerp.sale.dto.shopdashboard.ShopDashboardLowStockDTO;
import org.zerp.sale.dto.shopdashboard.ShopDashboardOverviewDTO;
import org.zerp.sale.dto.shopdashboard.ShopDashboardPerformanceDTO;
import org.zerp.sale.dto.shopdashboard.ShopDashboardSalesChannelDTO;
import org.zerp.sale.dto.shopdashboard.ShopDashboardTopProductDTO;
import org.zerp.sale.dto.shopdashboard.ShopDashboardTrendPointDTO;
import org.zerp.sale.permission.ShopPermissionEvaluator;
import org.zerp.sale.repository.ShopRepository;
import org.zerp.sale.repository.ShopTableRepository;
import org.zerp.sale.repository.StockResourceRepository;
import org.zerp.sale.repository.TableOrderRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShopDashboardService {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final int PERCENTAGE_SCALE = 2;
    private static final int CURRENCY_SCALE = 2;
    private static final int TREND_DAYS = 7;
    private static final int LOW_STOCK_LIMIT = 3;
    private static final List<ShopTableStatus> ACTIVE_TABLE_STATUSES =
            List.of(ShopTableStatus.OCCUPIED, ShopTableStatus.RESERVED);

    private final ShopRepository shopRepository;
    private final ShopPermissionEvaluator shopPermissionEvaluator;
    private final TableOrderRepository tableOrderRepository;
    private final ShopTableRepository shopTableRepository;
    private final StockResourceRepository stockResourceRepository;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;

    @Transactional(readOnly = true)
    public ShopDashboardOverviewDTO getOverview(UUID shopId) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        if (!Objects.equals(shop.getTenantId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Shop");
        }

        if (!shopPermissionEvaluator.canReadDashboard(userId, shop)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Dashboard");
        }

        ZoneId zoneId = ZoneId.systemDefault();
        LocalDateTime now = LocalDateTime.now(zoneId);
        LocalDate today = now.toLocalDate();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = startOfDay.plusDays(1);

        TableOrderRepository.DailyOrderMetricsAggregateRow todayMetrics = findOrderMetrics(
                shopId,
                tenantId,
                startOfDay,
                startOfNextDay
        );
        BigDecimal dailyRevenue = defaultIfNull(todayMetrics.getDailyRevenue());
        long paidOrderCount = defaultIfNull(todayMetrics.getPaidOrderCount());

        BigDecimal averageCheck = calculateAverageCheck(dailyRevenue, paidOrderCount);

        long activeTableCount = shopTableRepository.countByShopIdAndTenantIdAndStatusIn(
                shopId,
                tenantId,
                ACTIVE_TABLE_STATUSES
        );
        long totalTableCount = shopTableRepository.countByShopIdAndTenantId(shopId, tenantId);

        List<ShopDashboardCategorySalesDTO> categorySales = buildCategorySales(
                tableOrderRepository.findCategorySalesForDashboard(
                        shopId,
                        tenantId,
                        TableOrderStatus.PAID,
                        startOfDay,
                        startOfNextDay
                )
        );

        List<ShopDashboardTopProductDTO> topProducts = tableOrderRepository
                .findTopProductsForDashboard(
                        shopId,
                        tenantId,
                        TableOrderStatus.PAID,
                        startOfDay,
                        startOfNextDay
                )
                .stream()
                .map(row -> {
                    ShopDashboardTopProductDTO dto = new ShopDashboardTopProductDTO();
                    dto.setMenuItemId(row.getMenuItemId());
                    dto.setMenuItemName(row.getMenuItemName());
                    dto.setSoldCount(defaultIfNull(row.getSoldCount()));
                    dto.setRevenue(defaultIfNull(row.getRevenue()));
                    return dto;
                })
                .toList();

        List<ShopDashboardTrendPointDTO> trend = buildTrend(shopId, tenantId, today);
        List<ShopDashboardSalesChannelDTO> salesChannels = buildSalesChannels(paidOrderCount);
        ShopDashboardPerformanceDTO performance = buildPerformance(shopId, tenantId, now);
        List<ShopDashboardLowStockDTO> lowStock = buildLowStock(shopId, tenantId);

        ShopDashboardOverviewDTO overview = new ShopDashboardOverviewDTO();
        overview.setDailyRevenue(dailyRevenue);
        overview.setAverageCheck(averageCheck);
        overview.setActiveTableCount(activeTableCount);
        overview.setTotalTableCount(totalTableCount);
        overview.setTrend(trend);
        overview.setSalesChannels(salesChannels);
        overview.setCategorySales(categorySales);
        overview.setTopProducts(topProducts);
        overview.setPerformance(performance);
        overview.setLowStock(lowStock);
        overview.setLastUpdatedAt(now);

        return overview;
    }

    private List<ShopDashboardCategorySalesDTO> buildCategorySales(
            List<TableOrderRepository.CategorySalesAggregateRow> categoryRows
    ) {
        BigDecimal totalCategoryRevenue = categoryRows.stream()
                .map(TableOrderRepository.CategorySalesAggregateRow::getRevenue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return categoryRows.stream()
                .map(row -> {
                    ShopDashboardCategorySalesDTO dto = new ShopDashboardCategorySalesDTO();
                    BigDecimal revenue = defaultIfNull(row.getRevenue());
                    dto.setCategoryId(row.getCategoryId());
                    dto.setCategoryName(row.getCategoryName());
                    dto.setRevenue(revenue);
                    dto.setPercentage(calculatePercentage(revenue, totalCategoryRevenue));
                    return dto;
                })
                .toList();
    }

    private List<ShopDashboardTrendPointDTO> buildTrend(UUID shopId, UUID tenantId, LocalDate today) {
        List<ShopDashboardTrendPointDTO> trend = new ArrayList<>(TREND_DAYS);

        for (int dayOffset = TREND_DAYS - 1; dayOffset >= 0; dayOffset--) {
            LocalDate day = today.minusDays(dayOffset);
            LocalDateTime start = day.atStartOfDay();
            LocalDateTime end = start.plusDays(1);

            TableOrderRepository.DailyOrderMetricsAggregateRow metrics = findOrderMetrics(shopId, tenantId, start, end);
            BigDecimal revenue = defaultIfNull(metrics.getDailyRevenue());
            long count = defaultIfNull(metrics.getPaidOrderCount());

            ShopDashboardTrendPointDTO point = new ShopDashboardTrendPointDTO();
            point.setLabel(day.toString());
            point.setRevenue(revenue);
            point.setAverageCheck(calculateAverageCheck(revenue, count));
            trend.add(point);
        }

        return trend;
    }

    private List<ShopDashboardSalesChannelDTO> buildSalesChannels(long tableServiceOrderCount) {
        long totalOrders = tableServiceOrderCount;

        return List.of(
                buildSalesChannel("TABLE_SERVICE", tableServiceOrderCount, totalOrders),
                buildSalesChannel("TAKEAWAY", 0, totalOrders),
                buildSalesChannel("DELIVERY", 0, totalOrders),
                buildSalesChannel("ONLINE", 0, totalOrders)
        );
    }

    private ShopDashboardSalesChannelDTO buildSalesChannel(String channelId, long value, long total) {
        ShopDashboardSalesChannelDTO dto = new ShopDashboardSalesChannelDTO();
        dto.setChannelId(channelId);
        dto.setValue(value);

        if (total <= 0) {
            dto.setPercentage(BigDecimal.ZERO.setScale(PERCENTAGE_SCALE, RoundingMode.HALF_UP));
        } else {
            dto.setPercentage(
                    BigDecimal.valueOf(value)
                            .multiply(HUNDRED)
                            .divide(BigDecimal.valueOf(total), PERCENTAGE_SCALE, RoundingMode.HALF_UP)
            );
        }

        return dto;
    }

    private ShopDashboardPerformanceDTO buildPerformance(UUID shopId, UUID tenantId, LocalDateTime now) {
        LocalDate firstDayOfMonth = now.toLocalDate().withDayOfMonth(1);
        LocalDateTime currentStart = firstDayOfMonth.atStartOfDay();

        TableOrderRepository.DailyOrderMetricsAggregateRow currentMetrics =
                findOrderMetrics(shopId, tenantId, currentStart, now);

        LocalDateTime previousStart = currentStart.minusMonths(1);
        Duration elapsedDuration = Duration.between(currentStart, now);
        LocalDateTime previousEnd = previousStart.plus(elapsedDuration);

        TableOrderRepository.DailyOrderMetricsAggregateRow previousMetrics =
                findOrderMetrics(shopId, tenantId, previousStart, previousEnd);

        BigDecimal currentRevenue = defaultIfNull(currentMetrics.getDailyRevenue());
        long currentPaidOrderCount = defaultIfNull(currentMetrics.getPaidOrderCount());
        BigDecimal currentAverageCheck = calculateAverageCheck(currentRevenue, currentPaidOrderCount);

        BigDecimal previousRevenue = defaultIfNull(previousMetrics.getDailyRevenue());
        long previousPaidOrderCount = defaultIfNull(previousMetrics.getPaidOrderCount());
        BigDecimal previousAverageCheck = calculateAverageCheck(previousRevenue, previousPaidOrderCount);

        ShopDashboardPerformanceDTO performance = new ShopDashboardPerformanceDTO();
        performance.setTotalRevenue(currentRevenue);
        performance.setTotalRevenueDeltaPercentage(calculateDeltaPercentage(currentRevenue, previousRevenue));
        performance.setAverageCheck(currentAverageCheck);
        performance.setAverageCheckDeltaPercentage(calculateDeltaPercentage(currentAverageCheck, previousAverageCheck));
        performance.setTotalTableServiceCount(currentPaidOrderCount);
        performance.setTotalTableServiceCountDeltaPercentage(
                calculateDeltaPercentage(BigDecimal.valueOf(currentPaidOrderCount), BigDecimal.valueOf(previousPaidOrderCount))
        );
        performance.setCustomerSatisfaction(null);

        return performance;
    }

    private List<ShopDashboardLowStockDTO> buildLowStock(UUID shopId, UUID tenantId) {
        List<StockResource> lowStockResources = stockResourceRepository.findLowStockResourcesForDashboard(
                shopId,
                tenantId,
                BigDecimal.ZERO
        );

        return lowStockResources.stream()
                .limit(LOW_STOCK_LIMIT)
                .map(resource -> {
                    ShopDashboardLowStockDTO dto = new ShopDashboardLowStockDTO();
                    dto.setStockResourceId(resource.getId());
                    dto.setName(resource.getName());
                    dto.setQuantity(defaultIfNull(resource.getQuantity()));
                    dto.setReorderThreshold(defaultIfNull(resource.getReorderThreshold()));
                    dto.setUnitType(resource.getUnitType() == null ? null : resource.getUnitType().name());
                    return dto;
                })
                .toList();
    }

    private TableOrderRepository.DailyOrderMetricsAggregateRow findOrderMetrics(
            UUID shopId,
            UUID tenantId,
            LocalDateTime start,
            LocalDateTime end
    ) {
        TableOrderRepository.DailyOrderMetricsAggregateRow row = tableOrderRepository.findDailyOrderMetricsForDashboard(
                shopId,
                tenantId,
                TableOrderStatus.PAID,
                start,
                end
        );

        if (row == null) {
            return new EmptyDailyOrderMetricsAggregateRow();
        }

        return row;
    }

    private BigDecimal defaultIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private long defaultIfNull(Long value) {
        return value == null ? 0L : value;
    }

    private BigDecimal calculatePercentage(BigDecimal value, BigDecimal total) {
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO.setScale(PERCENTAGE_SCALE, RoundingMode.HALF_UP);
        }

        return value
                .multiply(HUNDRED)
                .divide(total, PERCENTAGE_SCALE, RoundingMode.HALF_UP);
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
