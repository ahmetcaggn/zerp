import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/sale/table/order/cubit/cubit_table_order.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/cancel_order_confirm_dialog.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/import_code_dialog.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold_messenger.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class OrderHeader extends StatelessWidget {
  const OrderHeader({
    required this.tableId,
    required this.currentOrder,
    super.key,
  });

  final String tableId;
  final OrderEntry currentOrder;

  Future<void> _scanQrToAppend(BuildContext context) async {
    final code = await ImportCodeDialog.show(context);
    if (code != null && code.isNotEmpty) {
      if (!context.mounted) return;
      final messenger = AppScaffoldMessenger.of(context);
      final strings = context.t;
      final success = await context
          .read<CubitTableOrder>()
          .importFromCodeToCurrentOrder(
            code: code,
            tableId: tableId,
          );
      if (context.mounted) {
        if (success) {
          messenger.showSuccess(strings.sale.order.qrImportSuccess);
        } else {
          messenger.showError(strings.sale.order.qrImportError);
        }
      }
    }
  }

  Future<void> _cancelCurrentOrder(BuildContext context) async {
    final confirm = await CancelOrderConfirmDialog.show(context);
    if (confirm == true) {
      if (!context.mounted) return;
      final messenger = AppScaffoldMessenger.of(context);
      final cancelMsg = context.t.sale.order.orderCancelled;
      final success = await context.read<CubitTableOrder>().cancelOrder(
        tableId: tableId,
      );
      if (context.mounted && success) {
        messenger.showSuccess(cancelMsg);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        const SizedBox(width: 8),
        IconButton(
          tooltip: context.t.sale.order.importOrder,
          icon: const Icon(Icons.qr_code_scanner),
          color: Theme.of(context).colorScheme.primary,
          onPressed: () => _scanQrToAppend(context),
        ),
        IconButton(
          tooltip: context.t.sale.order.cancelDialog.title,
          icon: const Icon(Icons.delete_outline),
          color: Colors.redAccent,
          onPressed: () => _cancelCurrentOrder(context),
        ),
        const SizedBox(width: 8),
      ],
    );
  }
}
