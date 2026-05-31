import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/dashboard/sections/tables_section/cubit_section_tables.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class SectionTables extends StatelessWidget {
  const SectionTables({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<CubitSectionTables>(),
      child: BlocBuilder<CubitOrganizationScope, StateOrganizationScope>(
        builder: (context, state) {
          final enabled = state is StateOrganizationScopeShop;
          return _SectionCard(
            icon: Icons.table_restaurant_outlined,
            title: context.t.sale.dashboard.tables,
            enabled: enabled,
            onTap: () {
              if (enabled) {
                unawaited(context.router.push(const RouteTables()));
              }
            },
          );
        },
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.icon,
    required this.title,
    required this.enabled,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final bool enabled;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final disabledColor = colorScheme.onSurface.withValues(alpha: 0.38);

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: enabled
              ? colorScheme.outlineVariant
              : colorScheme.outlineVariant.withValues(alpha: 0.5),
        ),
      ),
      color: enabled
          ? null
          : colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
      child: InkWell(
        onTap: enabled ? onTap : null,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: enabled
                      ? colorScheme.primaryContainer
                      : colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: enabled
                      ? colorScheme.onPrimaryContainer
                      : disabledColor,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: enabled ? null : disabledColor,
                      ),
                    ),
                    if (enabled)
                      BlocBuilder<CubitSectionTables, StateSectionTables>(
                        builder: (context, state) {
                          if (state is StateSectionTablesLoaded) {
                            final total = state.totalCount;
                            final available = state.availableCount;
                            final occupied = state.occupiedCount;
                            final reserved = state.reservedCount;
                            final outOfOrder = state.outOfOrderCount;
                            return Padding(
                              padding: const EdgeInsets.only(top: 4),
                              child: Wrap(
                                runSpacing: 12,
                                children: [
                                  _InfoTag(
                                    label: context.t.dashboard.tablesSection
                                        .total(count: total),
                                  ),
                                  const SizedBox(width: 8),
                                  _InfoTag(
                                    label: context.t.dashboard.tablesSection
                                        .available(count: available),
                                  ),
                                  const SizedBox(width: 8),
                                  _InfoTag(
                                    label: context.t.dashboard.tablesSection
                                        .occupied(count: occupied),
                                  ),
                                  const SizedBox(width: 8),
                                  _InfoTag(
                                    label: context.t.dashboard.tablesSection
                                        .reserved(count: reserved),
                                  ),
                                  const SizedBox(width: 8),
                                  _InfoTag(
                                    label: context.t.dashboard.tablesSection
                                        .outOfOrder(count: outOfOrder),
                                  ),
                                ],
                              ),
                            );
                          } else if (state is StateSectionTablesLoading) {
                            return const Padding(
                              padding: EdgeInsets.only(top: 4),
                              child: SizedBox(
                                width: 12,
                                height: 12,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              ),
                            );
                          }
                          return const SizedBox.shrink();
                        },
                      ),
                  ],
                ),
              ),
              Icon(
                Icons.chevron_right,
                color: enabled ? colorScheme.onSurfaceVariant : disabledColor,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

final class _InfoTag extends StatelessWidget {
  const _InfoTag({
    required this.label,
  });

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
      ),
    );
  }
}
