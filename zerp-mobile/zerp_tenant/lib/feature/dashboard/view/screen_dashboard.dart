import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart' hide RouteSettings;
import 'package:zerp_tenant/feature/dashboard/sections/employee_section/view/section_employee.dart';
import 'package:zerp_tenant/feature/dashboard/sections/menu_section/view/section_menu.dart';
import 'package:zerp_tenant/feature/dashboard/sections/sale_section/view/section_sale.dart';
import 'package:zerp_tenant/feature/dashboard/sections/stock_section/view/section_stock.dart';
import 'package:zerp_tenant/feature/dashboard/sections/store_section/view/section_store.dart';
import 'package:zerp_tenant/product/ui/layout/app_drawer.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenDashboard extends StatelessWidget {
  const ScreenDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: context.t.dashboard.title,
      drawer: const AppDrawer(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            context.t.feature.dashboard,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          const SectionEmployee(),
          const SizedBox(height: 12),
          const SectionMenu(),
          const SizedBox(height: 12),
          const SectionSale(),
          const SizedBox(height: 12),
          const SectionStock(),
          const SizedBox(height: 12),
          const SectionStore(),
        ],
      ),
    );
  }
}
