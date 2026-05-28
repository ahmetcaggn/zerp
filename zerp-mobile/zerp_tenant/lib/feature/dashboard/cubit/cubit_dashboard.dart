import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/dashboard/sections/employee_section/cubit_section_employee.dart';
import 'package:zerp_tenant/feature/dashboard/sections/menu_section/cubit_section_menu.dart';
import 'package:zerp_tenant/feature/dashboard/sections/sale_section/cubit_section_sale.dart';
import 'package:zerp_tenant/feature/dashboard/sections/stock_section/cubit_section_stock.dart';
import 'package:zerp_tenant/feature/dashboard/sections/store_section/cubit_section_store.dart';

@lazySingleton
class CubitDashboard extends Cubit<StateDashboard>
    with LoggerMixin<CubitDashboard> {
  CubitDashboard(
    this._cubitSectionEmployee,
    this._cubitSectionMenu,
    this._cubitSectionSale,
    this._cubitSectionStock,
    this._cubitSectionStore,
  ) : super(const StateDashboardInitial());

  final CubitSectionEmployee _cubitSectionEmployee;
  final CubitSectionMenu _cubitSectionMenu;
  final CubitSectionSale _cubitSectionSale;
  final CubitSectionStock _cubitSectionStock;
  final CubitSectionStore _cubitSectionStore;

  Future<void> load() async {
    emit(const StateDashboardLoading());

    await Future.wait<dynamic>([
      _cubitSectionEmployee.load(),
      _cubitSectionMenu.load(),
      _cubitSectionSale.load(),
      _cubitSectionStock.load(),
      _cubitSectionStore.load(),
    ]);
    emit(const StateDashboardLoaded());
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
  const StateDashboardLoaded();
}
