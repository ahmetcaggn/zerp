// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// AutoRouterGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:auto_route/auto_route.dart' as _i12;
import 'package:flutter/material.dart' as _i13;
import 'package:zerp_tenant/feature/auth/view/screen_auth.dart' as _i1;
import 'package:zerp_tenant/feature/dashboard/view/screen_dashboard.dart'
    as _i2;
import 'package:zerp_tenant/feature/employee/view/screen_employee.dart' as _i3;
import 'package:zerp_tenant/feature/menu/view/screen_menu.dart' as _i4;
import 'package:zerp_tenant/feature/permission_viewer/view/screen_permissions.dart'
    as _i5;
import 'package:zerp_tenant/feature/profile/view/screen_profile.dart' as _i6;
import 'package:zerp_tenant/feature/sale/view/screen_sale.dart' as _i7;
import 'package:zerp_tenant/feature/settings/view/screen_settings.dart' as _i8;
import 'package:zerp_tenant/feature/stock/view/screen_stock.dart' as _i10;
import 'package:zerp_tenant/feature/store/view/screen_store.dart' as _i11;
import 'package:zerp_tenant/product/ui/layout/screen_shell.dart' as _i9;

/// generated route for
/// [_i1.ScreenAuth]
class RouteAuth extends _i12.PageRouteInfo<RouteAuthArgs> {
  RouteAuth({
    _i13.Key? key,
    _i1.AfterAuthCallback? afterAuthCallback,
    String? callerRoute,
    List<_i12.PageRouteInfo>? children,
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

  static _i12.PageInfo page = _i12.PageInfo(
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

  final _i13.Key? key;

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
/// [_i2.ScreenDashboard]
class RouteDashboard extends _i12.PageRouteInfo<void> {
  const RouteDashboard({List<_i12.PageRouteInfo>? children})
    : super(RouteDashboard.name, initialChildren: children);

  static const String name = 'RouteDashboard';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i2.ScreenDashboard();
    },
  );
}

/// generated route for
/// [_i3.ScreenEmployee]
class RouteEmployee extends _i12.PageRouteInfo<void> {
  const RouteEmployee({List<_i12.PageRouteInfo>? children})
    : super(RouteEmployee.name, initialChildren: children);

  static const String name = 'RouteEmployee';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i3.ScreenEmployee();
    },
  );
}

/// generated route for
/// [_i4.ScreenMenu]
class RouteMenu extends _i12.PageRouteInfo<void> {
  const RouteMenu({List<_i12.PageRouteInfo>? children})
    : super(RouteMenu.name, initialChildren: children);

  static const String name = 'RouteMenu';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i4.ScreenMenu();
    },
  );
}

/// generated route for
/// [_i5.ScreenPermissions]
class RoutePermissions extends _i12.PageRouteInfo<void> {
  const RoutePermissions({List<_i12.PageRouteInfo>? children})
    : super(RoutePermissions.name, initialChildren: children);

  static const String name = 'RoutePermissions';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i5.ScreenPermissions();
    },
  );
}

/// generated route for
/// [_i6.ScreenProfile]
class RouteProfile extends _i12.PageRouteInfo<void> {
  const RouteProfile({List<_i12.PageRouteInfo>? children})
    : super(RouteProfile.name, initialChildren: children);

  static const String name = 'RouteProfile';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i6.ScreenProfile();
    },
  );
}

/// generated route for
/// [_i7.ScreenSale]
class RouteSale extends _i12.PageRouteInfo<void> {
  const RouteSale({List<_i12.PageRouteInfo>? children})
    : super(RouteSale.name, initialChildren: children);

  static const String name = 'RouteSale';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i7.ScreenSale();
    },
  );
}

/// generated route for
/// [_i8.ScreenSettings]
class RouteSettings extends _i12.PageRouteInfo<void> {
  const RouteSettings({List<_i12.PageRouteInfo>? children})
    : super(RouteSettings.name, initialChildren: children);

  static const String name = 'RouteSettings';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i8.ScreenSettings();
    },
  );
}

/// generated route for
/// [_i9.ScreenShell]
class RouteShell extends _i12.PageRouteInfo<void> {
  const RouteShell({List<_i12.PageRouteInfo>? children})
    : super(RouteShell.name, initialChildren: children);

  static const String name = 'RouteShell';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i9.ScreenShell();
    },
  );
}

/// generated route for
/// [_i10.ScreenStock]
class RouteStock extends _i12.PageRouteInfo<void> {
  const RouteStock({List<_i12.PageRouteInfo>? children})
    : super(RouteStock.name, initialChildren: children);

  static const String name = 'RouteStock';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i10.ScreenStock();
    },
  );
}

/// generated route for
/// [_i11.ScreenStore]
class RouteStore extends _i12.PageRouteInfo<void> {
  const RouteStore({List<_i12.PageRouteInfo>? children})
    : super(RouteStore.name, initialChildren: children);

  static const String name = 'RouteStore';

  static _i12.PageInfo page = _i12.PageInfo(
    name,
    builder: (data) {
      return const _i11.ScreenStore();
    },
  );
}
