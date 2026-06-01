import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart' hide RouteSettings;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/api.dart';
import 'package:zerp_tenant/feature/dashboard/cubit/cubit_dashboard.dart';
import 'package:zerp_tenant/feature/dashboard/sections/cash_section/section_cash.dart';
import 'package:zerp_tenant/feature/dashboard/sections/employee_section/section_employee.dart';
import 'package:zerp_tenant/feature/dashboard/sections/stock_section/section_stock.dart';
import 'package:zerp_tenant/feature/dashboard/sections/tables_section/section_tables.dart';
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
      child: BlocListener<CubitOrganizationScope, StateOrganizationScope>(
        listener: (context, state) {
          if (state is StateOrganizationScopeShop) {
            final shop = state.shop;
            unawaited(context.read<CubitDashboard>().notifyShopChanged(shop));
          }
        },
        child: AppScaffold(
          title: context.t.dashboard.title,
          drawer: const AppDrawer(),
          actions: const [
            _DashboardHeaderActions(),
          ],
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              const _TenantInfoSection(),
              const SizedBox(height: 16),
              const SectionEmployee(),
              const SizedBox(height: 16),
              const _ShopSelectorSection(),
              const SizedBox(height: 12),

              LayoutBuilder(
                builder: (context, constraints) {
                  if (constraints.maxWidth >= 600) {
                    return const Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(child: SectionTables()),
                        SizedBox(width: 12),
                        Expanded(child: SectionCash()),
                      ],
                    );
                  } else {
                    return const Column(
                      children: [
                        SectionTables(),
                        SizedBox(height: 12),
                        SectionCash(),
                      ],
                    );
                  }
                },
              ),

              const SizedBox(height: 12),
              const SectionStock(),
            ],
          ),
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
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.refresh_rounded),
            onPressed: isLoading ? null : context.read<CubitDashboard>().load,
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

class _ShopSelectorSection extends StatelessWidget {
  const _ShopSelectorSection();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitDashboard, StateDashboard>(
      builder: (context, state) {
        if (state is! StateDashboardLoaded) {
          return const SizedBox.shrink();
        }

        final shops = state.shops;

        if (shops.isEmpty) {
          return const SizedBox.shrink();
        }

        return BlocListener<CubitOrganizationScope, StateOrganizationScope>(
          listener: (context, orgState) {
            if (orgState is StateOrganizationScopeTenant &&
                orgState is! StateOrganizationScopeShop) {
              if (shops.isNotEmpty) {
                context.read<CubitOrganizationScope>().loadShop(shops.first);
              }
            }
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                context.t.sale.dashboard.selectShop,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color: Theme.of(context).colorScheme.outlineVariant,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 4,
                  ),
                  child: DropdownButtonHideUnderline(
                    child:
                        BlocBuilder<
                          CubitOrganizationScope,
                          StateOrganizationScope
                        >(
                          builder: (context, orgState) {
                            ShopDTO? selectedShop;
                            if (orgState is StateOrganizationScopeShop) {
                              final found = shops
                                  .where((s) => s.id == orgState.shop.id)
                                  .toList();
                              selectedShop = found.isNotEmpty
                                  ? found.first
                                  : null;
                            }

                            return DropdownButtonFormField<ShopDTO>(
                              initialValue: selectedShop,
                              decoration: const InputDecoration(
                                border: InputBorder.none,
                              ),
                              items: shops.map((shop) {
                                return DropdownMenuItem<ShopDTO>(
                                  value: shop,
                                  child: Text(
                                    shop.name ?? '',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                );
                              }).toList(),
                              onChanged: (shop) async {
                                if (shop != null) {
                                  context
                                      .read<CubitOrganizationScope>()
                                      .loadShop(
                                        shop,
                                      );
                                }
                              },
                            );
                          },
                        ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
