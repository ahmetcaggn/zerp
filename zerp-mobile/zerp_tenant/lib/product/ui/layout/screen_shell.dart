import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart' hide RouteSettings;
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/layout/app_drawer.dart';
import 'package:zerp_tenant/product/ui/layout/app_main_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenShell extends StatelessWidget {
  const ScreenShell({super.key});

  static const List<PageRouteInfo<void>> _sectionRoutes = [
    RouteDashboard(),
    RouteEmployee(),
    RouteMenu(),
    RouteSale(),
    RouteStock(),
    RouteStore(),
  ];

  @override
  Widget build(BuildContext context) {
    return AutoTabsRouter(
      routes: _sectionRoutes,
      builder: (context, child) {
        final tabsRouter = AutoTabsRouter.of(context);
        final sectionTitles = [
          context.t.shell.dashboard,
          context.t.shell.employees,
          context.t.shell.menu,
          context.t.shell.sales,
          context.t.shell.stock,
          context.t.shell.store,
        ];

        return AppMainScaffold(
          title: sectionTitles[tabsRouter.activeIndex],
          body: child,
          drawer: AppDrawer(
            activeIndex: tabsRouter.activeIndex,
            onSelectSection: (index) {
              if (index == tabsRouter.activeIndex) {
                Navigator.of(context).pop();
                return;
              }
              tabsRouter.setActiveIndex(index);
              Navigator.of(context).pop();
            },
            onTapProfile: () {
              unawaited(context.router.push(const RouteProfile()));
            },
            onTapSettings: () {
              unawaited(context.router.push(const RouteSettings()));
            },
          ),
        );
      },
    );
  }
}
