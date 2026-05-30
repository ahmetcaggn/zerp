import 'package:flutter/material.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class StockKpiRow extends StatelessWidget {
  const StockKpiRow({
    required this.overview,
    super.key,
  });

  final List<StockOverviewDTO> overview;

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;

    final totalVariance = overview.fold<double>(
      0,
      (sum, item) => sum + (item.variance?.toDouble().abs() ?? 0),
    );
    final negativeVarianceCount = overview
        .where((item) => (item.variance?.toDouble() ?? 0) < -0.0001)
        .length;

    final riskyTop5 = [...overview]
      ..sort(
        (a, b) => (b.variance?.toDouble().abs() ?? 0).compareTo(
          a.variance?.toDouble().abs() ?? 0,
        ),
      );
    final topRisky = riskyTop5
        .where((item) => (item.variance?.toDouble().abs() ?? 0) > 0.0001)
        .take(5)
        .toList();

    // Last completed count variance
    final lastCountVariance = overview.fold<double>(
      0,
      (sum, item) =>
          sum +
          (item.lastCountQuantity != null
              ? (item.lastCountQuantity! -
                        (item.expectedQuantity ?? item.lastCountQuantity!))
                    .abs()
                    .toDouble()
              : 0),
    );

    return SizedBox(
      height: 96,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        children: [
          SizedBox(
            width: 150,
            child: _KpiCard(
              label: t.kpi.totalVariance,
              value: _fmt(totalVariance),
              color: totalVariance > 0.0001 ? Colors.orange : null,
            ),
          ),
          const SizedBox(width: 8),
          SizedBox(
            width: 150,
            child: _KpiCard(
              label: t.kpi.negativeVarianceSku,
              value: negativeVarianceCount.toString(),
              color: negativeVarianceCount > 0 ? Colors.red : null,
            ),
          ),
          const SizedBox(width: 8),
          SizedBox(
            width: 220,
            child: _KpiCard(
              label: t.kpi.topRisky5,
              value: topRisky.isEmpty
                  ? t.kpi.topRisky5Empty
                  : topRisky
                        .map(
                          (e) =>
                              '${e.stockResourceName}: '
                              '${_fmt(e.variance?.toDouble() ?? 0)}',
                        )
                        .join('\n'),
              small: true,
            ),
          ),
          const SizedBox(width: 8),
          SizedBox(
            width: 150,
            child: _KpiCard(
              label: t.kpi.lastCountVariance,
              value: _fmt(lastCountVariance),
              color: lastCountVariance > 0.0001 ? Colors.orange : null,
            ),
          ),
        ],
      ),
    );
  }

  static String _fmt(double value) {
    final rounded = (value * 100).round() / 100;
    return rounded.toStringAsFixed(2);
  }
}

class _KpiCard extends StatelessWidget {
  const _KpiCard({
    required this.label,
    required this.value,
    this.color,
    this.small = false,
  });

  final String label;
  final String value;
  final Color? color;
  final bool small;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Card(
      elevation: 0,
      color: colorScheme.surfaceContainerHighest.withValues(alpha: 0.6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              label,
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Flexible(
              child: Text(
                value,
                style: small
                    ? Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: color ?? colorScheme.onSurface,
                        fontWeight: FontWeight.w600,
                        height: 1.3,
                      )
                    : Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: color ?? colorScheme.onSurface,
                        fontWeight: FontWeight.bold,
                      ),
                maxLines: small ? 5 : 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
