import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart' hide RouteSettings;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/dashboard/cubit/cubit_dashboard.dart';
import 'package:zerp_tenant/feature/dashboard/sections/employee_section/section_employee.dart';
import 'package:zerp_tenant/feature/dashboard/sections/menu_section/section_menu.dart';
import 'package:zerp_tenant/feature/dashboard/sections/sale_section/section_sale.dart';
import 'package:zerp_tenant/feature/dashboard/sections/stock_section/section_stock.dart';
import 'package:zerp_tenant/feature/dashboard/sections/store_section/section_store.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/ui/layout/app_drawer.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenDashboard extends StatelessWidget {
  const ScreenDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (_) {
            final cubit = getIt<CubitDashboard>();
            unawaited(cubit.load());
            return cubit;
          },
        ),
      ],
      child: AppScaffold(
        title: context.t.dashboard.title,
        drawer: const AppDrawer(),
        actions: const [
          _DashboardHeaderActions(),
        ],
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: const [
            _TenantInfoSection(),
            SizedBox(height: 16),
            SectionEmployee(),
            SizedBox(height: 12),
            SectionMenu(),
            SizedBox(height: 12),
            SectionSale(),
            SizedBox(height: 12),
            SectionStock(),
            SizedBox(height: 12),
            SectionStore(),
          ],
        ),
      ),
    );
  }
}

class _DashboardHeaderActions extends StatelessWidget {
  const _DashboardHeaderActions();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitDashboard, StateDashboard>(
      builder: (context, state) {
        final isLoading = state is StateDashboardLoading;

        return Tooltip(
          message: context.t.common.refresh,
          child: IconButton(
            icon: isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                    ),
                  )
                : const Icon(Icons.refresh_rounded),
            onPressed: isLoading
                ? null
                : () {
                    unawaited(context.read<CubitDashboard>().load());
                  },
          ),
        );
      },
    );
  }
}

class _TenantInfoSection extends StatelessWidget {
  const _TenantInfoSection();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitOrganizationScope, StateOrganizationScope>(
      builder: (context, state) {
        if (state is StateOrganizationScopeTenant) {
          final tenant = state.tenant;
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                tenant.name ?? context.t.dashboard.title,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (tenant.description?.isNotEmpty == true) ...[
                const SizedBox(height: 8),
                Text(
                  tenant.description!,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ],
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}
