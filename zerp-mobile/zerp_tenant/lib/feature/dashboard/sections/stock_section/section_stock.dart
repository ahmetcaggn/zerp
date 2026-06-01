import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/feature/dashboard/sections/stock_section/cubit_section_stock.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class SectionStock extends StatelessWidget {
  const SectionStock({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<CubitSectionStock>(),
      child: BlocBuilder<CubitOrganizationScope, StateOrganizationScope>(
        builder: (context, state) {
          final enabled = state is StateOrganizationScopeShop;
          final shopId = enabled ? state.shop.id : null;
          return _SectionCard(
            icon: Icons.inventory_2_outlined,
            title: context.t.dashboard.section.stock,
            enabled: enabled,
            shopId: shopId,
            onTap: () => context.router.push(const RouteStock()),
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
    required this.shopId,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final bool enabled;
  final String? shopId;
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
            crossAxisAlignment: CrossAxisAlignment.start,
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
                    if (enabled && shopId != null)
                      BlocBuilder<CubitSectionStock, StateSectionStock>(
                        builder: (context, state) {
                          if (state is StateSectionStockLoaded) {
                            return Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: _Loaded(state: state),
                            );
                          } else if (state is StateSectionStockLoading) {
                            return const Padding(
                              padding: EdgeInsets.only(top: 8),
                              child: SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              ),
                            );
                          } else if (state is StateSectionStockError) {
                            return Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: Text(
                                context.t.dashboard.stockSection.errorLoading,
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: colorScheme.error,
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
              const SizedBox(width: 8),
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

final class _Loaded extends StatelessWidget {
  const _Loaded({required this.state});

  final StateSectionStockLoaded state;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final resources = state.resources;
    final lowStockList = resources.where((r) {
      final qty = r.quantity?.toDouble() ?? 0;
      final threshold = r.reorderThreshold?.toDouble() ?? 0;
      return qty <= threshold && threshold > 0;
    }).toList();

    DateTime? maxCountedAt;
    if (state.recentCounts.isNotEmpty) {
      maxCountedAt = state.recentCounts.first.countDate;
    }

    final t = context.t.dashboard.stockSection;
    final isLowStock = lowStockList.isNotEmpty;
    final statusIcon = isLowStock
        ? Icons.warning_amber_rounded
        : Icons.check_circle_outline_rounded;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              statusIcon,
              size: 16,
              color: isLowStock ? colorScheme.error : colorScheme.primary,
            ),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                isLowStock
                    ? t.lowStockAlert(
                        count: lowStockList.length,
                      )
                    : t.noLowStock,
                style: theme.textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.w500,
                  color: isLowStock
                      ? colorScheme.error
                      : colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ],
        ),
        if (isLowStock)
          Padding(
            padding: const EdgeInsets.only(
              left: 22,
              top: 2,
            ),
            child: Text(
              lowStockList.map((r) => r.name ?? '').join(', '),
              style: theme.textTheme.labelSmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        const SizedBox(height: 6),
        Row(
          children: [
            Icon(
              Icons.calendar_month_outlined,
              size: 16,
              color: colorScheme.onSurfaceVariant,
            ),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                maxCountedAt != null
                    ? t.lastCounted(
                        date: _formatDateTime(
                          context,
                          maxCountedAt,
                        ),
                      )
                    : t.lastCountNever,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ],
        ),
        if (state.recentOperations.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text(
            t.recentMovements,
            style: theme.textTheme.labelMedium?.copyWith(
              color: colorScheme.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          ...state.recentOperations.map((op) {
            final isEntry =
                op.operationType == StockOperationDTOOperationTypeEnum.ENTRY;
            return Padding(
              padding: const EdgeInsets.only(
                bottom: 4,
              ),
              child: Row(
                children: [
                  Icon(
                    isEntry ? Icons.login : Icons.sync_alt,
                    size: 14,
                    color: colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      (op.referenceNo?.isNotEmpty == true)
                          ? op.referenceNo!
                          : (isEntry ? t.actions.entry : t.actions.adjustment),
                      style: theme.textTheme.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (op.createdAt != null)
                    Text(
                      _formatDateOnly(
                        context,
                        op.createdAt!,
                      ),
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                ],
              ),
            );
          }),
        ],
        if (state.recentCounts.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text(
            t.recentCounts,
            style: theme.textTheme.labelMedium?.copyWith(
              color: colorScheme.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          ...state.recentCounts.map((count) {
            return Padding(
              padding: const EdgeInsets.only(
                bottom: 4,
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.fact_check_outlined,
                    size: 14,
                    color: colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      count.notes?.isNotEmpty == true
                          ? count.notes!
                          : t.actions.newCount,
                      style: theme.textTheme.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (count.countDate != null)
                    Text(
                      _formatDateOnly(
                        context,
                        count.countDate!,
                      ),
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                ],
              ),
            );
          }),
        ],
      ],
    );
  }

  String _formatDateTime(BuildContext context, DateTime dateTime) {
    final localizations = MaterialLocalizations.of(context);
    final date = localizations.formatShortDate(dateTime);
    final time = localizations.formatTimeOfDay(
      TimeOfDay.fromDateTime(dateTime),
    );
    return '$date $time';
  }

  String _formatDateOnly(BuildContext context, DateTime dateTime) {
    final localizations = MaterialLocalizations.of(context);
    return localizations.formatShortDate(dateTime);
  }
}
