import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart' hide RouteSettings;
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/layout/app_drawer.dart';
import 'package:zerp_tenant/product/ui/layout/app_main_scaffold.dart';

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

  static const List<String> _sectionTitles = [
    'Dashboard',
    'Employees',
    'Menu',
    'Sales',
    'Stock',
    'Store',
  ];

  @override
  Widget build(BuildContext context) {
    return AutoTabsRouter(
      routes: _sectionRoutes,
      builder: (context, child) {
        final tabsRouter = AutoTabsRouter.of(context);

        return AppMainScaffold(
          title: _sectionTitles[tabsRouter.activeIndex],
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
            onTapSettings: () {
              Navigator.of(context).pop();
              unawaited(context.router.push(const RouteSettings()));
            },
          ),
        );
      },
    );
  }
}
