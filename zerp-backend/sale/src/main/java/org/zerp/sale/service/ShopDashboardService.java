package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.ShopTableStatus;
import org.zerp.common.entity.sale.TableOrderStatus;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.shopdashboard.ShopDashboardCategorySalesDTO;
import org.zerp.sale.dto.shopdashboard.ShopDashboardOverviewDTO;
import org.zerp.sale.dto.shopdashboard.ShopDashboardTopProductDTO;
import org.zerp.sale.permission.ShopPermissionEvaluator;
import org.zerp.sale.repository.ShopRepository;
import org.zerp.sale.repository.ShopTableRepository;
import org.zerp.sale.repository.TableOrderRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShopDashboardService {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final int PERCENTAGE_SCALE = 2;
    private static final int CURRENCY_SCALE = 2;
    private static final List<ShopTableStatus> ACTIVE_TABLE_STATUSES =
            List.of(ShopTableStatus.OCCUPIED, ShopTableStatus.RESERVED);

    private final ShopRepository shopRepository;
    private final ShopPermissionEvaluator shopPermissionEvaluator;
    private final TableOrderRepository tableOrderRepository;
    private final ShopTableRepository shopTableRepository;
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

        if (!shopPermissionEvaluator.canRead(userId, shop)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Shop");
        }

        ZoneId zoneId = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zoneId);
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = today.plusDays(1).atStartOfDay();

        TableOrderRepository.DailyOrderMetricsAggregateRow dailyMetricsRow =
                tableOrderRepository.findDailyOrderMetricsForDashboard(
                        shopId,
                        tenantId,
                        TableOrderStatus.PAID,
                        startOfDay,
                        startOfNextDay
                );

        BigDecimal dailyRevenue = defaultIfNull(dailyMetricsRow == null ? null : dailyMetricsRow.getDailyRevenue());
        long paidOrderCount =
                dailyMetricsRow == null || dailyMetricsRow.getPaidOrderCount() == null
                        ? 0L
                        : dailyMetricsRow.getPaidOrderCount();
        BigDecimal averageCheck = calculateAverageCheck(dailyRevenue, paidOrderCount);

        long activeTableCount = shopTableRepository.countByShopIdAndTenantIdAndStatus(
                shopId,
                tenantId,
                ShopTableStatus.AVAILABLE
        ) ;
        long totalTableCount = shopTableRepository.countByShopIdAndTenantId(shopId, tenantId);

        List<TableOrderRepository.CategorySalesAggregateRow> categoryRows =
                tableOrderRepository.findCategorySalesForDashboard(
                        shopId,
                        tenantId,
                        TableOrderStatus.PAID,
                        startOfDay,
                        startOfNextDay
                );

        BigDecimal totalCategoryRevenue = categoryRows.stream()
                .map(TableOrderRepository.CategorySalesAggregateRow::getRevenue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<ShopDashboardCategorySalesDTO> categorySales = categoryRows.stream()
                .map(row -> {
                    ShopDashboardCategorySalesDTO dto = new ShopDashboardCategorySalesDTO();
                    dto.setCategoryId(row.getCategoryId());
                    dto.setCategoryName(row.getCategoryName());
                    dto.setRevenue(defaultIfNull(row.getRevenue()));
                    dto.setPercentage(calculatePercentage(defaultIfNull(row.getRevenue()), totalCategoryRevenue));
                    return dto;
                })
                .toList();

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
                    dto.setSoldCount(row.getSoldCount() == null ? 0 : row.getSoldCount());
                    dto.setRevenue(defaultIfNull(row.getRevenue()));
                    return dto;
                })
                .toList();

        ShopDashboardOverviewDTO overview = new ShopDashboardOverviewDTO();
        overview.setDailyRevenue(dailyRevenue);
        overview.setAverageCheck(averageCheck);
        overview.setActiveTableCount(activeTableCount);
        overview.setTotalTableCount(totalTableCount);
        overview.setCategorySales(categorySales);
        overview.setTopProducts(topProducts);
        overview.setLastUpdatedAt(LocalDateTime.now(zoneId));

        return overview;
    }

    private BigDecimal defaultIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal calculatePercentage(BigDecimal value, BigDecimal total) {
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO.setScale(PERCENTAGE_SCALE, RoundingMode.HALF_UP);
        }

        return value
                .multiply(HUNDRED)
                .divide(total, PERCENTAGE_SCALE, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateAverageCheck(BigDecimal dailyRevenue, long paidOrderCount) {
        if (paidOrderCount <= 0L) {
            return BigDecimal.ZERO.setScale(CURRENCY_SCALE, RoundingMode.HALF_UP);
        }

        return dailyRevenue.divide(BigDecimal.valueOf(paidOrderCount), CURRENCY_SCALE, RoundingMode.HALF_UP);
    }
}
