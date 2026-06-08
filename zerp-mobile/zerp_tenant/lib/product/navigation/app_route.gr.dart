// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// AutoRouterGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:auto_route/auto_route.dart' as _i25;
import 'package:collection/collection.dart' as _i28;
import 'package:flutter/material.dart' as _i27;
import 'package:openapi_sale/api.dart' as _i30;
import 'package:openapi_user/api.dart' as _i26;
import 'package:zerp_tenant/feature/access_denied/screen_access_denied.dart'
    as _i1;
import 'package:zerp_tenant/feature/auth/view/screen_auth.dart' as _i2;
import 'package:zerp_tenant/feature/dashboard/screen_dashboard.dart' as _i8;
import 'package:zerp_tenant/feature/employee/create_employee/screen_create_employee.dart'
    as _i6;
import 'package:zerp_tenant/feature/employee/cubit/cubit_employee.dart' as _i31;
import 'package:zerp_tenant/feature/employee/screen_employee.dart' as _i10;
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_permission_viewer.dart'
    as _i33;
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_single_employee.dart'
    as _i34;
import 'package:zerp_tenant/feature/employee/single_employee/edit_employee/screen_edit_employee.dart'
    as _i9;
import 'package:zerp_tenant/feature/employee/single_employee/permissions/create_permission/screen_create_permission.dart'
    as _i7;
import 'package:zerp_tenant/feature/employee/single_employee/permissions/cubit_permissions.dart'
    as _i32;
import 'package:zerp_tenant/feature/employee/single_employee/permissions/screen_permissions.dart'
    as _i12;
import 'package:zerp_tenant/feature/employee/single_employee/screen_single_employee.dart'
    as _i20;
import 'package:zerp_tenant/feature/menu/view/screen_menu.dart' as _i11;
import 'package:zerp_tenant/feature/profile/permission/screen_profile_permissions.dart'
    as _i14;
import 'package:zerp_tenant/feature/profile/screen_profile.dart' as _i13;
import 'package:zerp_tenant/feature/sale/cash/cubit/cubit_cash_tables.dart'
    as _i29;
import 'package:zerp_tenant/feature/sale/cash/screen_cash_order.dart' as _i3;
import 'package:zerp_tenant/feature/sale/cash/screen_cash_payment.dart' as _i4;
import 'package:zerp_tenant/feature/sale/cash/screen_cash_tables.dart' as _i5;
import 'package:zerp_tenant/feature/sale/table/cubit/cubit_tables.dart' as _i35;
import 'package:zerp_tenant/feature/sale/table/order/screen_table_order.dart'
    as _i23;
import 'package:zerp_tenant/feature/sale/table/screen_tables.dart' as _i24;
import 'package:zerp_tenant/feature/settings/screen_settings.dart' as _i15;
import 'package:zerp_tenant/feature/settings/sections/api_baseurl/screen_settings_api_baseurl.dart'
    as _i16;
import 'package:zerp_tenant/feature/settings/sections/language/screen_settings_language.dart'
    as _i17;
import 'package:zerp_tenant/feature/settings/sections/logging_level/screen_settings_logging_level.dart'
    as _i18;
import 'package:zerp_tenant/feature/settings/sections/theme/screen_settings_theme.dart'
    as _i19;
import 'package:zerp_tenant/feature/stock/view/screen_stock.dart' as _i21;
import 'package:zerp_tenant/feature/store/view/screen_store.dart' as _i22;

/// generated route for
/// [_i1.ScreenAccessDenied]
class RouteAccessDenied extends _i25.PageRouteInfo<RouteAccessDeniedArgs> {
  RouteAccessDenied({
    required Set<_i26.PermittableTreeNodeDTOActionsEnum> requiredActions,
    _i27.Key? key,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RouteAccessDenied.name,
         args: RouteAccessDeniedArgs(
           requiredActions: requiredActions,
           key: key,
         ),
         initialChildren: children,
       );

  static const String name = 'RouteAccessDenied';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteAccessDeniedArgs>();
      return _i1.ScreenAccessDenied(
        requiredActions: args.requiredActions,
        key: args.key,
      );
    },
  );
}

class RouteAccessDeniedArgs {
  const RouteAccessDeniedArgs({required this.requiredActions, this.key});

  final Set<_i26.PermittableTreeNodeDTOActionsEnum> requiredActions;

  final _i27.Key? key;

  @override
  String toString() {
    return 'RouteAccessDeniedArgs{requiredActions: $requiredActions, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteAccessDeniedArgs) return false;
    return const _i28.SetEquality<_i26.PermittableTreeNodeDTOActionsEnum>()
            .equals(requiredActions, other.requiredActions) &&
        key == other.key;
  }

  @override
  int get hashCode =>
      const _i28.SetEquality<_i26.PermittableTreeNodeDTOActionsEnum>().hash(
        requiredActions,
      ) ^
      key.hashCode;
}

/// generated route for
/// [_i2.ScreenAuth]
class RouteAuth extends _i25.PageRouteInfo<RouteAuthArgs> {
  RouteAuth({
    _i27.Key? key,
    _i2.AfterAuthCallback? afterAuthCallback,
    String? callerRoute,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RouteAuth.name,
         args: RouteAuthArgs(
           key: key,
           afterAuthCallback: afterAuthCallback,
           callerRoute: callerRoute,
         ),
         initialChildren: children,
       );

  static const String name = 'RouteAuth';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteAuthArgs>(
        orElse: () => const RouteAuthArgs(),
      );
      return _i2.ScreenAuth(
        key: args.key,
        afterAuthCallback: args.afterAuthCallback,
        callerRoute: args.callerRoute,
      );
    },
  );
}

class RouteAuthArgs {
  const RouteAuthArgs({this.key, this.afterAuthCallback, this.callerRoute});

  final _i27.Key? key;

  final _i2.AfterAuthCallback? afterAuthCallback;

  final String? callerRoute;

  @override
  String toString() {
    return 'RouteAuthArgs{key: $key, afterAuthCallback: $afterAuthCallback, callerRoute: $callerRoute}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteAuthArgs) return false;
    return key == other.key &&
        afterAuthCallback == other.afterAuthCallback &&
        callerRoute == other.callerRoute;
  }

  @override
  int get hashCode =>
      key.hashCode ^ afterAuthCallback.hashCode ^ callerRoute.hashCode;
}

/// generated route for
/// [_i3.ScreenCashOrder]
class RouteCashOrder extends _i25.PageRouteInfo<RouteCashOrderArgs> {
  RouteCashOrder({
    required String tableId,
    required String tableName,
    required _i29.CubitCashTables cubitCashTables,
    _i27.Key? key,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RouteCashOrder.name,
         args: RouteCashOrderArgs(
           tableId: tableId,
           tableName: tableName,
           cubitCashTables: cubitCashTables,
           key: key,
         ),
         initialChildren: children,
       );

  static const String name = 'RouteCashOrder';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteCashOrderArgs>();
      return _i3.ScreenCashOrder(
        tableId: args.tableId,
        tableName: args.tableName,
        cubitCashTables: args.cubitCashTables,
        key: args.key,
      );
    },
  );
}

class RouteCashOrderArgs {
  const RouteCashOrderArgs({
    required this.tableId,
    required this.tableName,
    required this.cubitCashTables,
    this.key,
  });

  final String tableId;

  final String tableName;

  final _i29.CubitCashTables cubitCashTables;

  final _i27.Key? key;

  @override
  String toString() {
    return 'RouteCashOrderArgs{tableId: $tableId, tableName: $tableName, cubitCashTables: $cubitCashTables, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteCashOrderArgs) return false;
    return tableId == other.tableId &&
        tableName == other.tableName &&
        cubitCashTables == other.cubitCashTables &&
        key == other.key;
  }

  @override
  int get hashCode =>
      tableId.hashCode ^
      tableName.hashCode ^
      cubitCashTables.hashCode ^
      key.hashCode;
}

/// generated route for
/// [_i4.ScreenCashPayment]
class RouteCashPayment extends _i25.PageRouteInfo<RouteCashPaymentArgs> {
  RouteCashPayment({
    required List<_i30.TableOrderDTO> orders,
    required Map<String, int> selectedQtys,
    _i27.Key? key,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RouteCashPayment.name,
         args: RouteCashPaymentArgs(
           orders: orders,
           selectedQtys: selectedQtys,
           key: key,
         ),
         initialChildren: children,
       );

  static const String name = 'RouteCashPayment';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteCashPaymentArgs>();
      return _i4.ScreenCashPayment(
        orders: args.orders,
        selectedQtys: args.selectedQtys,
        key: args.key,
      );
    },
  );
}

class RouteCashPaymentArgs {
  const RouteCashPaymentArgs({
    required this.orders,
    required this.selectedQtys,
    this.key,
  });

  final List<_i30.TableOrderDTO> orders;

  final Map<String, int> selectedQtys;

  final _i27.Key? key;

  @override
  String toString() {
    return 'RouteCashPaymentArgs{orders: $orders, selectedQtys: $selectedQtys, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteCashPaymentArgs) return false;
    return const _i28.ListEquality<_i30.TableOrderDTO>().equals(
          orders,
          other.orders,
        ) &&
        const _i28.MapEquality<String, int>().equals(
          selectedQtys,
          other.selectedQtys,
        ) &&
        key == other.key;
  }

  @override
  int get hashCode =>
      const _i28.ListEquality<_i30.TableOrderDTO>().hash(orders) ^
      const _i28.MapEquality<String, int>().hash(selectedQtys) ^
      key.hashCode;
}

/// generated route for
/// [_i5.ScreenCashTables]
class RouteCashTables extends _i25.PageRouteInfo<void> {
  const RouteCashTables({List<_i25.PageRouteInfo>? children})
    : super(RouteCashTables.name, initialChildren: children);

  static const String name = 'RouteCashTables';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i5.ScreenCashTables();
    },
  );
}

/// generated route for
/// [_i6.ScreenCreateEmployee]
class RouteCreateEmployee extends _i25.PageRouteInfo<RouteCreateEmployeeArgs> {
  RouteCreateEmployee({
    required _i31.CubitEmployee cubitEmployee,
    _i27.Key? key,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RouteCreateEmployee.name,
         args: RouteCreateEmployeeArgs(cubitEmployee: cubitEmployee, key: key),
         initialChildren: children,
       );

  static const String name = 'RouteCreateEmployee';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteCreateEmployeeArgs>();
      return _i6.ScreenCreateEmployee(
        cubitEmployee: args.cubitEmployee,
        key: args.key,
      );
    },
  );
}

class RouteCreateEmployeeArgs {
  const RouteCreateEmployeeArgs({required this.cubitEmployee, this.key});

  final _i31.CubitEmployee cubitEmployee;

  final _i27.Key? key;

  @override
  String toString() {
    return 'RouteCreateEmployeeArgs{cubitEmployee: $cubitEmployee, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteCreateEmployeeArgs) return false;
    return cubitEmployee == other.cubitEmployee && key == other.key;
  }

  @override
  int get hashCode => cubitEmployee.hashCode ^ key.hashCode;
}

/// generated route for
/// [_i7.ScreenCreatePermission]
class RouteCreatePermission
    extends _i25.PageRouteInfo<RouteCreatePermissionArgs> {
  RouteCreatePermission({
    required String employeeId,
    required _i32.CubitPermissions cubitPermission,
    required _i33.CubitPermissionViewer cubitPermissionViewer,
    _i27.Key? key,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RouteCreatePermission.name,
         args: RouteCreatePermissionArgs(
           employeeId: employeeId,
           cubitPermission: cubitPermission,
           cubitPermissionViewer: cubitPermissionViewer,
           key: key,
         ),
         initialChildren: children,
       );

  static const String name = 'RouteCreatePermission';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteCreatePermissionArgs>();
      return _i7.ScreenCreatePermission(
        employeeId: args.employeeId,
        cubitPermission: args.cubitPermission,
        cubitPermissionViewer: args.cubitPermissionViewer,
        key: args.key,
      );
    },
  );
}

class RouteCreatePermissionArgs {
  const RouteCreatePermissionArgs({
    required this.employeeId,
    required this.cubitPermission,
    required this.cubitPermissionViewer,
    this.key,
  });

  final String employeeId;

  final _i32.CubitPermissions cubitPermission;

  final _i33.CubitPermissionViewer cubitPermissionViewer;

  final _i27.Key? key;

  @override
  String toString() {
    return 'RouteCreatePermissionArgs{employeeId: $employeeId, cubitPermission: $cubitPermission, cubitPermissionViewer: $cubitPermissionViewer, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteCreatePermissionArgs) return false;
    return employeeId == other.employeeId &&
        cubitPermission == other.cubitPermission &&
        cubitPermissionViewer == other.cubitPermissionViewer &&
        key == other.key;
  }

  @override
  int get hashCode =>
      employeeId.hashCode ^
      cubitPermission.hashCode ^
      cubitPermissionViewer.hashCode ^
      key.hashCode;
}

/// generated route for
/// [_i8.ScreenDashboard]
class RouteDashboard extends _i25.PageRouteInfo<void> {
  const RouteDashboard({List<_i25.PageRouteInfo>? children})
    : super(RouteDashboard.name, initialChildren: children);

  static const String name = 'RouteDashboard';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i8.ScreenDashboard();
    },
  );
}

/// generated route for
/// [_i9.ScreenEditEmployee]
class RouteEditEmployee extends _i25.PageRouteInfo<RouteEditEmployeeArgs> {
  RouteEditEmployee({
    required String employeeId,
    required _i34.CubitSingleEmployee cubitSingleEmployee,
    required _i31.CubitEmployee cubitEmployee,
    _i27.Key? key,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RouteEditEmployee.name,
         args: RouteEditEmployeeArgs(
           employeeId: employeeId,
           cubitSingleEmployee: cubitSingleEmployee,
           cubitEmployee: cubitEmployee,
           key: key,
         ),
         initialChildren: children,
       );

  static const String name = 'RouteEditEmployee';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteEditEmployeeArgs>();
      return _i9.ScreenEditEmployee(
        employeeId: args.employeeId,
        cubitSingleEmployee: args.cubitSingleEmployee,
        cubitEmployee: args.cubitEmployee,
        key: args.key,
      );
    },
  );
}

class RouteEditEmployeeArgs {
  const RouteEditEmployeeArgs({
    required this.employeeId,
    required this.cubitSingleEmployee,
    required this.cubitEmployee,
    this.key,
  });

  final String employeeId;

  final _i34.CubitSingleEmployee cubitSingleEmployee;

  final _i31.CubitEmployee cubitEmployee;

  final _i27.Key? key;

  @override
  String toString() {
    return 'RouteEditEmployeeArgs{employeeId: $employeeId, cubitSingleEmployee: $cubitSingleEmployee, cubitEmployee: $cubitEmployee, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteEditEmployeeArgs) return false;
    return employeeId == other.employeeId &&
        cubitSingleEmployee == other.cubitSingleEmployee &&
        cubitEmployee == other.cubitEmployee &&
        key == other.key;
  }

  @override
  int get hashCode =>
      employeeId.hashCode ^
      cubitSingleEmployee.hashCode ^
      cubitEmployee.hashCode ^
      key.hashCode;
}

/// generated route for
/// [_i10.ScreenEmployee]
class RouteEmployee extends _i25.PageRouteInfo<void> {
  const RouteEmployee({List<_i25.PageRouteInfo>? children})
    : super(RouteEmployee.name, initialChildren: children);

  static const String name = 'RouteEmployee';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i10.ScreenEmployee();
    },
  );
}

/// generated route for
/// [_i11.ScreenMenu]
class RouteMenu extends _i25.PageRouteInfo<void> {
  const RouteMenu({List<_i25.PageRouteInfo>? children})
    : super(RouteMenu.name, initialChildren: children);

  static const String name = 'RouteMenu';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i11.ScreenMenu();
    },
  );
}

/// generated route for
/// [_i12.ScreenPermissions]
class RoutePermissions extends _i25.PageRouteInfo<RoutePermissionsArgs> {
  RoutePermissions({
    required String employeeId,
    required _i33.CubitPermissionViewer cubitPermissionViewer,
    _i27.Key? key,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RoutePermissions.name,
         args: RoutePermissionsArgs(
           employeeId: employeeId,
           cubitPermissionViewer: cubitPermissionViewer,
           key: key,
         ),
         initialChildren: children,
       );

  static const String name = 'RoutePermissions';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RoutePermissionsArgs>();
      return _i12.ScreenPermissions(
        employeeId: args.employeeId,
        cubitPermissionViewer: args.cubitPermissionViewer,
        key: args.key,
      );
    },
  );
}

class RoutePermissionsArgs {
  const RoutePermissionsArgs({
    required this.employeeId,
    required this.cubitPermissionViewer,
    this.key,
  });

  final String employeeId;

  final _i33.CubitPermissionViewer cubitPermissionViewer;

  final _i27.Key? key;

  @override
  String toString() {
    return 'RoutePermissionsArgs{employeeId: $employeeId, cubitPermissionViewer: $cubitPermissionViewer, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RoutePermissionsArgs) return false;
    return employeeId == other.employeeId &&
        cubitPermissionViewer == other.cubitPermissionViewer &&
        key == other.key;
  }

  @override
  int get hashCode =>
      employeeId.hashCode ^ cubitPermissionViewer.hashCode ^ key.hashCode;
}

/// generated route for
/// [_i13.ScreenProfile]
class RouteProfile extends _i25.PageRouteInfo<void> {
  const RouteProfile({List<_i25.PageRouteInfo>? children})
    : super(RouteProfile.name, initialChildren: children);

  static const String name = 'RouteProfile';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i13.ScreenProfile();
    },
  );
}

/// generated route for
/// [_i14.ScreenProfilePermissions]
class RouteProfilePermissions extends _i25.PageRouteInfo<void> {
  const RouteProfilePermissions({List<_i25.PageRouteInfo>? children})
    : super(RouteProfilePermissions.name, initialChildren: children);

  static const String name = 'RouteProfilePermissions';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i14.ScreenProfilePermissions();
    },
  );
}

/// generated route for
/// [_i15.ScreenSettings]
class RouteSettings extends _i25.PageRouteInfo<void> {
  const RouteSettings({List<_i25.PageRouteInfo>? children})
    : super(RouteSettings.name, initialChildren: children);

  static const String name = 'RouteSettings';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i15.ScreenSettings();
    },
  );
}

/// generated route for
/// [_i16.ScreenSettingsApiBaseUrl]
class RouteSettingsApiBaseUrl extends _i25.PageRouteInfo<void> {
  const RouteSettingsApiBaseUrl({List<_i25.PageRouteInfo>? children})
    : super(RouteSettingsApiBaseUrl.name, initialChildren: children);

  static const String name = 'RouteSettingsApiBaseUrl';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i16.ScreenSettingsApiBaseUrl();
    },
  );
}

/// generated route for
/// [_i17.ScreenSettingsLanguage]
class RouteSettingsLanguage extends _i25.PageRouteInfo<void> {
  const RouteSettingsLanguage({List<_i25.PageRouteInfo>? children})
    : super(RouteSettingsLanguage.name, initialChildren: children);

  static const String name = 'RouteSettingsLanguage';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i17.ScreenSettingsLanguage();
    },
  );
}

/// generated route for
/// [_i18.ScreenSettingsLoggingLevel]
class RouteSettingsLoggingLevel extends _i25.PageRouteInfo<void> {
  const RouteSettingsLoggingLevel({List<_i25.PageRouteInfo>? children})
    : super(RouteSettingsLoggingLevel.name, initialChildren: children);

  static const String name = 'RouteSettingsLoggingLevel';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i18.ScreenSettingsLoggingLevel();
    },
  );
}

/// generated route for
/// [_i19.ScreenSettingsTheme]
class RouteSettingsTheme extends _i25.PageRouteInfo<void> {
  const RouteSettingsTheme({List<_i25.PageRouteInfo>? children})
    : super(RouteSettingsTheme.name, initialChildren: children);

  static const String name = 'RouteSettingsTheme';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i19.ScreenSettingsTheme();
    },
  );
}

/// generated route for
/// [_i20.ScreenSingleEmployee]
class RouteSingleEmployee extends _i25.PageRouteInfo<RouteSingleEmployeeArgs> {
  RouteSingleEmployee({
    required String employeeId,
    required _i31.CubitEmployee cubitEmployee,
    _i27.Key? key,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RouteSingleEmployee.name,
         args: RouteSingleEmployeeArgs(
           employeeId: employeeId,
           cubitEmployee: cubitEmployee,
           key: key,
         ),
         initialChildren: children,
       );

  static const String name = 'RouteSingleEmployee';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteSingleEmployeeArgs>();
      return _i20.ScreenSingleEmployee(
        employeeId: args.employeeId,
        cubitEmployee: args.cubitEmployee,
        key: args.key,
      );
    },
  );
}

class RouteSingleEmployeeArgs {
  const RouteSingleEmployeeArgs({
    required this.employeeId,
    required this.cubitEmployee,
    this.key,
  });

  final String employeeId;

  final _i31.CubitEmployee cubitEmployee;

  final _i27.Key? key;

  @override
  String toString() {
    return 'RouteSingleEmployeeArgs{employeeId: $employeeId, cubitEmployee: $cubitEmployee, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteSingleEmployeeArgs) return false;
    return employeeId == other.employeeId &&
        cubitEmployee == other.cubitEmployee &&
        key == other.key;
  }

  @override
  int get hashCode =>
      employeeId.hashCode ^ cubitEmployee.hashCode ^ key.hashCode;
}

/// generated route for
/// [_i21.ScreenStock]
class RouteStock extends _i25.PageRouteInfo<void> {
  const RouteStock({List<_i25.PageRouteInfo>? children})
    : super(RouteStock.name, initialChildren: children);

  static const String name = 'RouteStock';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i21.ScreenStock();
    },
  );
}

/// generated route for
/// [_i22.ScreenStore]
class RouteStore extends _i25.PageRouteInfo<void> {
  const RouteStore({List<_i25.PageRouteInfo>? children})
    : super(RouteStore.name, initialChildren: children);

  static const String name = 'RouteStore';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i22.ScreenStore();
    },
  );
}

/// generated route for
/// [_i23.ScreenTableOrder]
class RouteTableOrder extends _i25.PageRouteInfo<RouteTableOrderArgs> {
  RouteTableOrder({
    required String tableId,
    required String tableName,
    required _i35.CubitTables cubitTables,
    _i27.Key? key,
    List<_i25.PageRouteInfo>? children,
  }) : super(
         RouteTableOrder.name,
         args: RouteTableOrderArgs(
           tableId: tableId,
           tableName: tableName,
           cubitTables: cubitTables,
           key: key,
         ),
         initialChildren: children,
       );

  static const String name = 'RouteTableOrder';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteTableOrderArgs>();
      return _i23.ScreenTableOrder(
        tableId: args.tableId,
        tableName: args.tableName,
        cubitTables: args.cubitTables,
        key: args.key,
      );
    },
  );
}

class RouteTableOrderArgs {
  const RouteTableOrderArgs({
    required this.tableId,
    required this.tableName,
    required this.cubitTables,
    this.key,
  });

  final String tableId;

  final String tableName;

  final _i35.CubitTables cubitTables;

  final _i27.Key? key;

  @override
  String toString() {
    return 'RouteTableOrderArgs{tableId: $tableId, tableName: $tableName, cubitTables: $cubitTables, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteTableOrderArgs) return false;
    return tableId == other.tableId &&
        tableName == other.tableName &&
        cubitTables == other.cubitTables &&
        key == other.key;
  }

  @override
  int get hashCode =>
      tableId.hashCode ^
      tableName.hashCode ^
      cubitTables.hashCode ^
      key.hashCode;
}

/// generated route for
/// [_i24.ScreenTables]
class RouteTables extends _i25.PageRouteInfo<void> {
  const RouteTables({List<_i25.PageRouteInfo>? children})
    : super(RouteTables.name, initialChildren: children);

  static const String name = 'RouteTables';

  static _i25.PageInfo page = _i25.PageInfo(
    name,
    builder: (data) {
      return const _i24.ScreenTables();
    },
  );
}
