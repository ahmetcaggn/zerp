// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// AutoRouterGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:auto_route/auto_route.dart' as _i3;
import 'package:end_user_app/feature/home/screen_home.dart' as _i1;
import 'package:end_user_app/feature/login/screen_login.dart' as _i2;

/// generated route for
/// [_i1.ScreenHome]
class RouteHome extends _i3.PageRouteInfo<void> {
  const RouteHome({List<_i3.PageRouteInfo>? children})
    : super(RouteHome.name, initialChildren: children);

  static const String name = 'RouteHome';

  static _i3.PageInfo page = _i3.PageInfo(
    name,
    builder: (data) {
      return const _i1.ScreenHome();
    },
  );
}

/// generated route for
/// [_i2.ScreenLogin]
class RouteLogin extends _i3.PageRouteInfo<void> {
  const RouteLogin({List<_i3.PageRouteInfo>? children})
    : super(RouteLogin.name, initialChildren: children);

  static const String name = 'RouteLogin';

  static _i3.PageInfo page = _i3.PageInfo(
    name,
    builder: (data) {
      return const _i2.ScreenLogin();
    },
  );
}
