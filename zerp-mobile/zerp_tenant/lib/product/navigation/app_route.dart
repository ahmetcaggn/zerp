import 'package:auto_route/auto_route.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';

@AutoRouterConfig(replaceInRouteName: AppRoute._replaceInRouteName)
class AppRoute extends RootStackRouter {
  static const String _replaceInRouteName = 'Screen,Route';

  @override
  List<AutoRoute> get routes => [
    AutoRoute(page: RouteSplash.page, initial: true),
    AutoRoute(page: RouteLogin.page),
    AutoRoute(page: RouteSettings.page),
    AutoRoute(page: RouteDashboard.page),
    AutoRoute(page: RouteEmployee.page),
    AutoRoute(page: RouteMenu.page),
    AutoRoute(page: RouteSale.page),
    AutoRoute(page: RouteStock.page),
    AutoRoute(page: RouteStore.page),
  ];
}
