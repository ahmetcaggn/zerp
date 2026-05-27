import 'package:flutter/material.dart';
import 'package:openapi_sale/model/shop_table_dto.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

typedef TableStatus = ShopTableDTOStatusEnum;

class CashTableCard extends StatelessWidget {
  const CashTableCard({
    required this.table,
    this.onTap,
    super.key,
  });

  final ShopTableDTO table;
  final VoidCallback? onTap;

  Color _getStatusColor(BuildContext context, TableStatus? status) {
    switch (status) {
      case TableStatus.AVAILABLE:
        return Colors.green;
      case TableStatus.OCCUPIED:
        return Colors.red;
      case TableStatus.RESERVED:
        return Colors.orange;
      case TableStatus.OUT_OF_ORDER:
        return Colors.grey;
      case null:
        return Colors.grey;
    }
  }

  String _getStatusText(BuildContext context, TableStatus? status) {
    final statusMap = {
      TableStatus.AVAILABLE: context.t.sale.tables.status.AVAILABLE,
      TableStatus.OCCUPIED: context.t.sale.tables.status.OCCUPIED,
      TableStatus.RESERVED: context.t.sale.tables.status.RESERVED,
      TableStatus.OUT_OF_ORDER: context.t.sale.tables.status.OUT_OF_ORDER,
    };
    return statusMap[status] ?? status?.value ?? '';
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor(context, table.status);
    final statusText = _getStatusText(context, table.status);

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                table.name ?? '',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const Spacer(),
              Row(
                children: [
                  Icon(
                    Icons.circle,
                    size: 10,
                    color: statusColor,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      statusText,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: statusColor,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
