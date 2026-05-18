import 'package:auto_route/auto_route.dart';
import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/navigation/auth_guard.dart';

const String _replaceInRouteName = 'Screen,Route';

@singleton
@AutoRouterConfig(replaceInRouteName: _replaceInRouteName)
class AppRoute extends RootStackRouter {
  AppRoute(this.authGuard);

  final AuthGuard authGuard;

  @override
  List<AutoRoute> get routes => [
    AutoRoute(page: RouteDashboard.page, initial: true),
    AutoRoute(page: RouteEmployee.page),
    AutoRoute(page: RouteMenu.page),
    AutoRoute(page: RouteSale.page),
    AutoRoute(page: RouteStock.page),
    AutoRoute(page: RouteStore.page),

    // employee routes
    AutoRoute(page: RouteSingleEmployee.page),
    AutoRoute(page: RouteCreateEmployee.page),
    AutoRoute(page: RouteEditEmployee.page),
    AutoRoute(page: RoutePermissions.page),
    AutoRoute(page: RouteCreatePermission.page),

    // standalone routes
    AutoRoute(page: RouteAuth.page),
    AutoRoute(page: RouteProfile.page),
    AutoRoute(page: RouteSettings.page),
    AutoRoute(page: RouteSettingsApiBaseUrl.page),
  ];

  @override
  List<AutoRouteGuard> get guards => [authGuard];
}
