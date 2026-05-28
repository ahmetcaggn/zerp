import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/dashboard/sections/employee_section/cubit_section_employee.dart';
import 'package:zerp_tenant/feature/dashboard/sections/menu_section/cubit_section_menu.dart';
import 'package:zerp_tenant/feature/dashboard/sections/sale_section/cubit_section_sale.dart';
import 'package:zerp_tenant/feature/dashboard/sections/stock_section/cubit_section_stock.dart';
import 'package:zerp_tenant/feature/dashboard/sections/store_section/cubit_section_store.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';
import 'package:zerp_tenant/product/service/tenant/tenant_service.dart';

@lazySingleton
class CubitDashboard extends Cubit<StateDashboard>
    with LoggerMixin<CubitDashboard> {
  CubitDashboard(
    this._cubitSectionEmployee,
    this._cubitSectionMenu,
    this._cubitSectionSale,
    this._cubitSectionStock,
    this._cubitSectionStore,
    this._authStorageService,
    this._tenantService,
  ) : super(const StateDashboardInitial());

  final CubitSectionEmployee _cubitSectionEmployee;
  final CubitSectionMenu _cubitSectionMenu;
  final CubitSectionSale _cubitSectionSale;
  final CubitSectionStock _cubitSectionStock;
  final CubitSectionStore _cubitSectionStore;
  final AuthStorageService _authStorageService;
  final TenantService _tenantService;

  Future<void> load() async {
    emit(const StateDashboardLoading());

    TenantResponseDTO? tenant;
    try {
      final claims = await _authStorageService.authClaimsIfValid;
      final tenantId = claims?.tenantId;
      if (tenantId != null &&
          tenantId != '00000000-0000-0000-0000-000000000000') {
        tenant = await _tenantService.getTenant(id: tenantId);
      }
    } on Object catch (e, s) {
      log.severe('Failed to fetch tenant info for dashboard', e, s);
    }

    await Future.wait<dynamic>([
      _cubitSectionEmployee.load(),
      _cubitSectionMenu.load(),
      _cubitSectionSale.load(),
      _cubitSectionStock.load(),
      _cubitSectionStore.load(),
    ]);
    emit(StateDashboardLoaded(tenant: tenant));
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
  const StateDashboardLoaded({this.tenant});

  final TenantResponseDTO? tenant;
}
