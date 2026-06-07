import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/dashboard/sections/cash_section/cubit_section_cash.dart';
import 'package:zerp_tenant/feature/dashboard/sections/employee_section/cubit_section_employee.dart';
import 'package:zerp_tenant/feature/dashboard/sections/stock_section/cubit_section_stock.dart';
import 'package:zerp_tenant/feature/dashboard/sections/tables_section/cubit_section_tables.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/permission/cubit_permission.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

typedef PermittableAction = PermittableTreeNodeDTOActionsEnum;

@lazySingleton
class CubitDashboard extends Cubit<StateDashboard>
    with LoggerMixin<CubitDashboard> {
  CubitDashboard(
    this._cubitSectionEmployee,
    this._cubitSectionStock,
    this._cubitSectionCash,
    this._cubitSectionTables,
    this._saleService,
    this._cubitOrganizationScope,
    this._cubitPermission,
  ) : super(const StateDashboardInitial());

  final CubitSectionEmployee _cubitSectionEmployee;
  final CubitSectionStock _cubitSectionStock;
  final CubitSectionCash _cubitSectionCash;
  final CubitSectionTables _cubitSectionTables;
  final SaleService _saleService;
  final CubitOrganizationScope _cubitOrganizationScope;
  final CubitPermission _cubitPermission;

  Future<void> load() async {
    emit(const StateDashboardLoading());

    try {
      final permState = _cubitPermission.state;
      final canReadEmployee =
          permState is StatePermissionLoaded &&
          permState.hasActionInScope(PermittableAction.READ_EMPLOYEE, null);

      late final PageResponse<ShopDTO> shopsResponse;
      await Future.wait<dynamic>([
        _cubitOrganizationScope.loadTenantIfNeeded(),
        if (canReadEmployee) _cubitSectionEmployee.load(),
        _saleService.getShops().then((value) => shopsResponse = value),
      ]);
      final shops = shopsResponse.items;
      final orgState = _cubitOrganizationScope.state;
      if (orgState is StateOrganizationScopeShop) {
        final shopId = orgState.shop.id;
        if (shopId != null) {
          final canReadTables =
              permState is StatePermissionLoaded &&
              permState.hasActionInScope(
                PermittableAction.READ_SHOP_TABLE,
                shopId,
              );
          final canReadStock =
              permState is StatePermissionLoaded &&
              permState.hasActionInScope(
                PermittableAction.READ_STOCK_RESOURCE,
                shopId,
              );

          await Future.wait([
            if (canReadTables) _cubitSectionCash.load(shopId),
            if (canReadTables) _cubitSectionTables.load(shopId),
            if (canReadStock) _cubitSectionStock.load(shopId),
          ]);
        }
      } else if (shops.isNotEmpty) {
        _cubitOrganizationScope.loadShop(shops.first);
      }

      emit(StateDashboardLoaded(shops: shops));
    } on Object catch (e, s) {
      log.severe('Failed to load dashboard', e, s);
      emit(
        StateDashboardError(
          message: t.sale.errors.failedToLoadShops(error: e.toString()),
        ),
      );
    }
  }

  Future<void> notifyShopChanged(ShopDTO shop) async {
    final shopId = shop.id ?? '';
    final permState = _cubitPermission.state;
    final canReadTables =
        permState is StatePermissionLoaded &&
        permState.hasActionInScope(PermittableAction.READ_SHOP_TABLE, shopId);
    final canReadStock =
        permState is StatePermissionLoaded &&
        permState.hasActionInScope(
          PermittableAction.READ_STOCK_RESOURCE,
          shopId,
        );

    await Future.wait([
      if (canReadTables) _cubitSectionCash.load(shopId),
      if (canReadTables) _cubitSectionTables.load(shopId),
      if (canReadStock) _cubitSectionStock.load(shopId),
    ]);
  }
}

sealed class StateDashboard {
  const StateDashboard();
}

final class StateDashboardInitial extends StateDashboard {
  const StateDashboardInitial();
}

final class StateDashboardLoading extends StateDashboard {
  const StateDashboardLoading();
}

final class StateDashboardLoaded extends StateDashboard {
  const StateDashboardLoaded({required this.shops});

  final List<ShopDTO> shops;
}

final class StateDashboardError extends StateDashboard {
  const StateDashboardError({required this.message});

  final String message;
}
