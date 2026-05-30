import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/api.dart';
import 'package:zerp_tenant/feature/dashboard/sections/cash_section/cubit_section_cash.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class SectionCash extends StatelessWidget {
  const SectionCash({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<CubitSectionCash>(),
      child: BlocBuilder<CubitOrganizationScope, StateOrganizationScope>(
        builder: (context, state) {
          final enabled = state is StateOrganizationScopeShop;
          return _SectionCard(
            icon: Icons.point_of_sale_outlined,
            title: context.t.sale.dashboard.cash,
            enabled: enabled,
            onTap: () {
              if (enabled) {
                unawaited(context.router.push(const RouteCashTables()));
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
                      BlocBuilder<CubitSectionCash, StateSectionCash>(
                        builder: (context, state) {
                          if (state is StateSectionCashLoaded) {
                            final orders = state.latestOrders;
                            if (orders.isEmpty) {
                              return Padding(
                                padding: const EdgeInsets.only(top: 4),
                                child: Text(
                                  context.t.sale.cash.noOpenOrders,
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              );
                            }
                            return Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: _OrderHistoryCard(orders: orders),
                            );
                          } else if (state is StateSectionCashLoading) {
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

class _OrderHistoryCard extends StatelessWidget {
  const _OrderHistoryCard({
    required this.orders,
  });

  final List<CashOrderPreview> orders;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            context.t.sale.cash.lastOrders,
            style: theme.textTheme.bodySmall?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          for (var i = 0; i < orders.length; i++) ...[
            if (i > 0)
              Divider(
                height: 12,
                color: colorScheme.outlineVariant,
              ),
            _OrderPreviewRow(
              order: orders[i],
              index: i,
            ),
          ],
        ],
      ),
    );
  }
}

class _OrderPreviewRow extends StatelessWidget {
  const _OrderPreviewRow({
    required this.order,
    required this.index,
  });

  final CashOrderPreview order;
  final int index;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final metaDate = _formatDateTime(context, order.createdAt);
    final statusLabel = _statusLabel(order.status);
    final metaText = metaDate == '-' ? statusLabel : '$statusLabel • $metaDate';
    final subtitleParts = <String>[];
    if (order.tableName != null && order.tableName!.isNotEmpty) {
      subtitleParts.add(order.tableName!);
    }
    subtitleParts.add(context.t.sale.cash.itemCount(n: order.itemCount));

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  subtitleParts.join(' • '),
                  style: theme.textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${order.total.toStringAsFixed(2)} ₺',
                style: theme.textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                metaText,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

String _statusLabel(TableOrderDTOStatusEnum? status) {
  switch (status) {
    case TableOrderDTOStatusEnum.OPEN:
      return 'OPEN';
    case TableOrderDTOStatusEnum.PAID:
      return 'PAID';
    case TableOrderDTOStatusEnum.CANCELLED:
      return 'CANCELLED';
    case null:
      return '-';
  }
}

String _formatDateTime(BuildContext context, DateTime? dateTime) {
  if (dateTime == null) return '-';
  final localizations = MaterialLocalizations.of(context);
  final date = localizations.formatShortDate(dateTime);
  final time = localizations.formatTimeOfDay(
    TimeOfDay.fromDateTime(dateTime),
  );
  return '$date $time';
}
