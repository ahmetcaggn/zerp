import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart' hide RouteSettings;
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: Theme.of(context).primaryColor),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  context.t.app.name,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  context.t.app.menu,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),

          ListTile(
            leading: const Icon(Icons.people),
            title: Text(context.t.shell.employees),
            onTap: () => _navigate(context, const RouteEmployee()),
          ),
          ListTile(
            leading: const Icon(Icons.restaurant_menu),
            title: Text(context.t.shell.menu),
            onTap: () => _navigate(context, const RouteMenu()),
          ),
          ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: Text(context.t.shell.sales),
            onTap: () => _navigate(context, const RouteSale()),
          ),
          ListTile(
            leading: const Icon(Icons.inventory),
            title: Text(context.t.shell.stock),
            onTap: () => _navigate(context, const RouteStock()),
          ),
          ListTile(
            leading: const Icon(Icons.store),
            title: Text(context.t.shell.store),
            onTap: () => _navigate(context, const RouteStore()),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.person),
            title: Text(context.t.shell.profile),
            onTap: () => _navigate(context, const RouteProfile()),
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: Text(context.t.shell.settings),
            onTap: () => _navigate(context, const RouteSettings()),
          ),
        ],
      ),
    );
  }

  void _navigate(BuildContext context, PageRouteInfo route) {
    if (context.router.current.name == route.routeName) {
      Navigator.pop(context);
      return;
    }
    unawaited(context.router.push(route));
  }
}
