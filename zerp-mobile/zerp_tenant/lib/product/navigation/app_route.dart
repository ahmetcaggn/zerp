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
    // Main page
    AutoRoute(page: RouteDashboard.page, initial: true),

    // employee routes
    AutoRoute(page: RouteEmployee.page),
    AutoRoute(page: RouteSingleEmployee.page),
    AutoRoute(page: RouteCreateEmployee.page),
    AutoRoute(page: RouteEditEmployee.page),
    AutoRoute(page: RoutePermissions.page),
    AutoRoute(page: RouteCreatePermission.page),

    // Menu
    AutoRoute(page: RouteMenu.page),

    // Sale
    AutoRoute(page: RouteSale.page),
    AutoRoute(page: RouteTables.page),
    AutoRoute(page: RouteTableOrder.page),
    AutoRoute(page: RouteCashTables.page),
    AutoRoute(page: RouteCashOrder.page),
    AutoRoute(page: RouteCashPayment.page),

    // Stock
    AutoRoute(page: RouteStock.page),

    // Store
    AutoRoute(page: RouteStore.page),

    // Profile
    AutoRoute(page: RouteProfile.page),
    AutoRoute(page: RouteProfilePermissions.page),

    // Settings
    AutoRoute(page: RouteSettings.page),
    AutoRoute(page: RouteSettingsApiBaseUrl.page),

    // Auth
    AutoRoute(page: RouteAuth.page),
  ];

  @override
  List<AutoRouteGuard> get guards => [authGuard];
}
