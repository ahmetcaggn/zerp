import 'package:auto_route/auto_route.dart';

import 'package:end_user_app/product/config/route/app_route.gr.dart';

const String _replaceInRouteName = 'Screen,Route';

@AutoRouterConfig(replaceInRouteName: _replaceInRouteName)
final class AppRoute extends RootStackRouter {
  @override
  List<AutoRoute> get routes => [
    AutoRoute(page: RouteLogin.page, initial: true),
    AutoRoute(page: RouteHome.page),
  ];
}
