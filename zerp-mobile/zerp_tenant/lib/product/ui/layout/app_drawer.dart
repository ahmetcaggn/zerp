import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart' hide RouteSettings;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/auth/view/widget/logging_out_dialog.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<CubitAuth>().state;
    final orgState = context.watch<CubitOrganizationScope>().state;

    String? username;
    String? email;
    if (authState is StateAuthAuthenticated) {
      username = authState.username;
      email = authState.email;
    }

    String? firmName;
    if (orgState is StateOrganizationScopeTenant) {
      firmName = orgState.tenant.name;
    }

    return Drawer(
      child: Column(
        children: [
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                DrawerHeader(
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            backgroundColor: Colors.white.withValues(
                              alpha: 0.2,
                            ),
                            radius: 24,
                            child: Text(
                              (username != null && username.isNotEmpty)
                                  ? username[0].toUpperCase()
                                  : 'U',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 20,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  username ?? '',
                                  style: Theme.of(context).textTheme.titleMedium
                                      ?.copyWith(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                if (email != null && email.isNotEmpty) ...[
                                  const SizedBox(height: 2),
                                  Text(
                                    email,
                                    style: Theme.of(context).textTheme.bodySmall
                                        ?.copyWith(
                                          color: Colors.white70,
                                        ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                      if (firmName != null && firmName.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            const Icon(
                              Icons.business,
                              color: Colors.white70,
                              size: 16,
                            ),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                firmName,
                                style: Theme.of(context).textTheme.bodyMedium
                                    ?.copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w500,
                                    ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),

                ListTile(
                  leading: const Icon(Icons.people),
                  title: Text(context.t.employee.title),
                  onTap: () => _navigate(context, const RouteEmployee()),
                ),
                ListTile(
                  leading: const Icon(Icons.table_restaurant),
                  title: Text(context.t.sale.dashboard.tables),
                  onTap: () => _navigate(context, const RouteTables()),
                ),
                ListTile(
                  leading: const Icon(Icons.point_of_sale),
                  title: Text(context.t.sale.dashboard.cash),
                  onTap: () => _navigate(context, const RouteCashTables()),
                ),
                ListTile(
                  leading: const Icon(Icons.inventory),
                  title: Text(context.t.stock.title),
                  onTap: () => _navigate(context, const RouteStock()),
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.person),
                  title: Text(context.t.profile.title),
                  onTap: () => _navigate(context, const RouteProfile()),
                ),
                ListTile(
                  leading: const Icon(Icons.settings),
                  title: Text(context.t.settings.title),
                  onTap: () => _navigate(context, const RouteSettings()),
                ),
              ],
            ),
          ),
          const Divider(),
          SafeArea(
            top: false,
            child: ListTile(
              leading: Icon(
                Icons.logout,
                color: Theme.of(context).colorScheme.error,
              ),
              title: Text(
                context.t.auth.logout,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.error,
                ),
              ),
              onTap: () async {
                Navigator.pop(context);
                await LoggingOutDialog.show(context);
              },
            ),
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
    Navigator.pop(context);
    unawaited(context.router.push(route));
  }
}
