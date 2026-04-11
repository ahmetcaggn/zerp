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
    // home
    AutoRoute(page: RouteDashboard.page, initial: true),

    // misc
    AutoRoute(page: RouteAuth.page),
    AutoRoute(page: RouteSettings.page),

    // features
    AutoRoute(page: RouteEmployee.page),
    AutoRoute(page: RouteMenu.page),
    AutoRoute(page: RouteSale.page),
    AutoRoute(page: RouteStock.page),
    AutoRoute(page: RouteStore.page),
  ];

  @override
  List<AutoRouteGuard> get guards => [authGuard];
}
