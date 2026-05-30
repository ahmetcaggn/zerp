import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class StockOperationDetailSheet extends StatelessWidget {
  const StockOperationDetailSheet({
    required this.operation,
    super.key,
  });

  final StockOperationDTO operation;

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;
    final items = operation.items;
    final operationType = operation.operationType?.value ?? 'UNKNOWN';

    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.6,
      maxChildSize: 0.95,
      builder: (context, scrollController) => ListView(
        controller: scrollController,
        padding: const EdgeInsets.all(24),
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.outlineVariant,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Text(
            t.operation.detailTitle,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          _InfoRow(
            label: t.operation.type,
            value:
                (context.t['stock.operation.types.$operationType']
                    as String?) ??
                operation.operationType?.value ??
                '-',
          ),
          _InfoRow(
            label: t.operation.status,
            value:
                (context.t['stock.operation.statuses.$operationType']
                    as String?) ??
                operation.status?.value ??
                '-',
          ),
          if (operation.referenceNo?.isNotEmpty ?? false)
            _InfoRow(
              label: t.operation.referenceNo,
              value: operation.referenceNo!,
            ),
          if (operation.shopName?.isNotEmpty ?? false)
            _InfoRow(label: 'Shop', value: operation.shopName!),
          if (operation.createdAt != null)
            _InfoRow(
              label: t.movement.date,
              value: DateFormat.yMMMd().add_jm().format(
                operation.createdAt!,
              ),
            ),
          if (operation.notes?.isNotEmpty ?? false)
            _InfoRow(label: t.operation.notes, value: operation.notes!),
          const Divider(height: 24),
          if (items.isEmpty)
            Text(
              t.operation.emptyDetailItems,
              style: Theme.of(context).textTheme.bodySmall,
            )
          else
            ...items.map((item) {
              final directionValue = item.direction?.value ?? 'UNKNOWN';
              final directionLabel =
                  (context.t['stock.operation.directions.$directionValue']
                      as String?) ??
                  item.direction?.value ??
                  '';
              final isIncrease = item.direction?.value == 'INCREASE';
              final qty = item.quantity?.toDouble() ?? 0;
              final qtyText =
                  '${isIncrease ? '+' : '-'}${qty.toStringAsFixed(2)}';
              final qtyColor = isIncrease ? Colors.green : Colors.red;

              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.stockResourceName ??
                                item.stockResourceId ??
                                '',
                            style: Theme.of(context).textTheme.bodyMedium
                                ?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          if (item.reason?.isNotEmpty ?? false)
                            Text(
                              item.reason!,
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                            ),
                          Text(
                            directionLabel,
                            style: Theme.of(context).textTheme.labelSmall,
                          ),
                        ],
                      ),
                    ),
                    Text(
                      qtyText,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: qtyColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}
