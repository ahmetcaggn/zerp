// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// AutoRouterGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:auto_route/auto_route.dart' as _i16;
import 'package:flutter/material.dart' as _i17;
import 'package:zerp_tenant/feature/auth/view/screen_auth.dart' as _i1;
import 'package:zerp_tenant/feature/dashboard/view/screen_dashboard.dart'
    as _i3;
import 'package:zerp_tenant/feature/employee/create_employee/screen_create_employee.dart'
    as _i2;
import 'package:zerp_tenant/feature/employee/cubit/cubit_employee.dart' as _i18;
import 'package:zerp_tenant/feature/employee/screen_employee.dart' as _i5;
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_permission_viewer.dart'
    as _i21;
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_single_employee.dart'
    as _i19;
import 'package:zerp_tenant/feature/employee/single_employee/edit_employee/screen_edit_employee.dart'
    as _i4;
import 'package:zerp_tenant/feature/employee/single_employee/permissions/cubit_permissions.dart'
    as _i20;
import 'package:zerp_tenant/feature/employee/single_employee/permissions/manage_permission/screen_manage_permission.dart'
    as _i6;
import 'package:zerp_tenant/feature/employee/single_employee/permissions/screen_permissions.dart'
    as _i8;
import 'package:zerp_tenant/feature/employee/single_employee/screen_single_employee.dart'
    as _i13;
import 'package:zerp_tenant/feature/menu/view/screen_menu.dart' as _i7;
import 'package:zerp_tenant/feature/profile/view/screen_profile.dart' as _i9;
import 'package:zerp_tenant/feature/sale/view/screen_sale.dart' as _i10;
import 'package:zerp_tenant/feature/settings/view/screen_settings.dart' as _i11;
import 'package:zerp_tenant/feature/stock/view/screen_stock.dart' as _i14;
import 'package:zerp_tenant/feature/store/view/screen_store.dart' as _i15;
import 'package:zerp_tenant/product/ui/layout/screen_shell.dart' as _i12;

/// generated route for
/// [_i1.ScreenAuth]
class RouteAuth extends _i16.PageRouteInfo<RouteAuthArgs> {
  RouteAuth({
    _i17.Key? key,
    _i1.AfterAuthCallback? afterAuthCallback,
    String? callerRoute,
    List<_i16.PageRouteInfo>? children,
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

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteAuthArgs>(
        orElse: () => const RouteAuthArgs(),
      );
      return _i1.ScreenAuth(
        key: args.key,
        afterAuthCallback: args.afterAuthCallback,
        callerRoute: args.callerRoute,
      );
    },
  );
}

class RouteAuthArgs {
  const RouteAuthArgs({this.key, this.afterAuthCallback, this.callerRoute});

  final _i17.Key? key;

  final _i1.AfterAuthCallback? afterAuthCallback;

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
/// [_i2.ScreenCreateEmployee]
class RouteCreateEmployee extends _i16.PageRouteInfo<RouteCreateEmployeeArgs> {
  RouteCreateEmployee({
    required _i18.CubitEmployee cubitEmployee,
    _i17.Key? key,
    List<_i16.PageRouteInfo>? children,
  }) : super(
         RouteCreateEmployee.name,
         args: RouteCreateEmployeeArgs(cubitEmployee: cubitEmployee, key: key),
         initialChildren: children,
       );

  static const String name = 'RouteCreateEmployee';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteCreateEmployeeArgs>();
      return _i2.ScreenCreateEmployee(
        cubitEmployee: args.cubitEmployee,
        key: args.key,
      );
    },
  );
}

class RouteCreateEmployeeArgs {
  const RouteCreateEmployeeArgs({required this.cubitEmployee, this.key});

  final _i18.CubitEmployee cubitEmployee;

  final _i17.Key? key;

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
/// [_i3.ScreenDashboard]
class RouteDashboard extends _i16.PageRouteInfo<void> {
  const RouteDashboard({List<_i16.PageRouteInfo>? children})
    : super(RouteDashboard.name, initialChildren: children);

  static const String name = 'RouteDashboard';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      return const _i3.ScreenDashboard();
    },
  );
}

/// generated route for
/// [_i4.ScreenEditEmployee]
class RouteEditEmployee extends _i16.PageRouteInfo<RouteEditEmployeeArgs> {
  RouteEditEmployee({
    required String employeeId,
    required _i19.CubitSingleEmployee cubitSingleEmployee,
    required _i18.CubitEmployee cubitEmployee,
    _i17.Key? key,
    List<_i16.PageRouteInfo>? children,
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

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteEditEmployeeArgs>();
      return _i4.ScreenEditEmployee(
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

  final _i19.CubitSingleEmployee cubitSingleEmployee;

  final _i18.CubitEmployee cubitEmployee;

  final _i17.Key? key;

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
/// [_i5.ScreenEmployee]
class RouteEmployee extends _i16.PageRouteInfo<void> {
  const RouteEmployee({List<_i16.PageRouteInfo>? children})
    : super(RouteEmployee.name, initialChildren: children);

  static const String name = 'RouteEmployee';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      return const _i5.ScreenEmployee();
    },
  );
}

/// generated route for
/// [_i6.ScreenManagePermission]
class RouteManagePermission
    extends _i16.PageRouteInfo<RouteManagePermissionArgs> {
  RouteManagePermission({
    required String employeeId,
    required _i20.CubitPermissions cubitPermission,
    required _i21.CubitPermissionViewer cubitPermissionViewer,
    _i17.Key? key,
    List<_i16.PageRouteInfo>? children,
  }) : super(
         RouteManagePermission.name,
         args: RouteManagePermissionArgs(
           employeeId: employeeId,
           cubitPermission: cubitPermission,
           cubitPermissionViewer: cubitPermissionViewer,
           key: key,
         ),
         initialChildren: children,
       );

  static const String name = 'RouteManagePermission';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteManagePermissionArgs>();
      return _i6.ScreenManagePermission(
        employeeId: args.employeeId,
        cubitPermission: args.cubitPermission,
        cubitPermissionViewer: args.cubitPermissionViewer,
        key: args.key,
      );
    },
  );
}

class RouteManagePermissionArgs {
  const RouteManagePermissionArgs({
    required this.employeeId,
    required this.cubitPermission,
    required this.cubitPermissionViewer,
    this.key,
  });

  final String employeeId;

  final _i20.CubitPermissions cubitPermission;

  final _i21.CubitPermissionViewer cubitPermissionViewer;

  final _i17.Key? key;

  @override
  String toString() {
    return 'RouteManagePermissionArgs{employeeId: $employeeId, cubitPermission: $cubitPermission, cubitPermissionViewer: $cubitPermissionViewer, key: $key}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! RouteManagePermissionArgs) return false;
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
/// [_i7.ScreenMenu]
class RouteMenu extends _i16.PageRouteInfo<void> {
  const RouteMenu({List<_i16.PageRouteInfo>? children})
    : super(RouteMenu.name, initialChildren: children);

  static const String name = 'RouteMenu';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      return const _i7.ScreenMenu();
    },
  );
}

/// generated route for
/// [_i8.ScreenPermissions]
class RoutePermissions extends _i16.PageRouteInfo<RoutePermissionsArgs> {
  RoutePermissions({
    required String employeeId,
    required _i21.CubitPermissionViewer cubitPermissionViewer,
    _i17.Key? key,
    List<_i16.PageRouteInfo>? children,
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

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RoutePermissionsArgs>();
      return _i8.ScreenPermissions(
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

  final _i21.CubitPermissionViewer cubitPermissionViewer;

  final _i17.Key? key;

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
/// [_i9.ScreenProfile]
class RouteProfile extends _i16.PageRouteInfo<void> {
  const RouteProfile({List<_i16.PageRouteInfo>? children})
    : super(RouteProfile.name, initialChildren: children);

  static const String name = 'RouteProfile';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      return const _i9.ScreenProfile();
    },
  );
}

/// generated route for
/// [_i10.ScreenSale]
class RouteSale extends _i16.PageRouteInfo<void> {
  const RouteSale({List<_i16.PageRouteInfo>? children})
    : super(RouteSale.name, initialChildren: children);

  static const String name = 'RouteSale';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      return const _i10.ScreenSale();
    },
  );
}

/// generated route for
/// [_i11.ScreenSettings]
class RouteSettings extends _i16.PageRouteInfo<void> {
  const RouteSettings({List<_i16.PageRouteInfo>? children})
    : super(RouteSettings.name, initialChildren: children);

  static const String name = 'RouteSettings';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      return const _i11.ScreenSettings();
    },
  );
}

/// generated route for
/// [_i12.ScreenShell]
class RouteShell extends _i16.PageRouteInfo<void> {
  const RouteShell({List<_i16.PageRouteInfo>? children})
    : super(RouteShell.name, initialChildren: children);

  static const String name = 'RouteShell';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      return const _i12.ScreenShell();
    },
  );
}

/// generated route for
/// [_i13.ScreenSingleEmployee]
class RouteSingleEmployee extends _i16.PageRouteInfo<RouteSingleEmployeeArgs> {
  RouteSingleEmployee({
    required String employeeId,
    required _i18.CubitEmployee cubitEmployee,
    _i17.Key? key,
    List<_i16.PageRouteInfo>? children,
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

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<RouteSingleEmployeeArgs>();
      return _i13.ScreenSingleEmployee(
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

  final _i18.CubitEmployee cubitEmployee;

  final _i17.Key? key;

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
/// [_i14.ScreenStock]
class RouteStock extends _i16.PageRouteInfo<void> {
  const RouteStock({List<_i16.PageRouteInfo>? children})
    : super(RouteStock.name, initialChildren: children);

  static const String name = 'RouteStock';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      return const _i14.ScreenStock();
    },
  );
}

/// generated route for
/// [_i15.ScreenStore]
class RouteStore extends _i16.PageRouteInfo<void> {
  const RouteStore({List<_i16.PageRouteInfo>? children})
    : super(RouteStore.name, initialChildren: children);

  static const String name = 'RouteStore';

  static _i16.PageInfo page = _i16.PageInfo(
    name,
    builder: (data) {
      return const _i15.ScreenStore();
    },
  );
}
