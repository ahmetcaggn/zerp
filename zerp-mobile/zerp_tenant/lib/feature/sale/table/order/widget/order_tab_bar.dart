import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/sale/table/order/cubit/cubit_table_order.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/import_code_dialog.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold_messenger.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class OrderTabBar extends StatelessWidget {
  const OrderTabBar({
    required this.state,
    required this.tableId,
    super.key,
  });

  final StateTableOrderLoaded state;
  final String tableId;

  Future<void> _scanQrForNewOrder(BuildContext context) async {
    final code = await ImportCodeDialog.show(context);
    if (code != null && code.isNotEmpty) {
      if (!context.mounted) return;
      final messenger = AppScaffoldMessenger.of(context);
      final strings = context.t;
      final success = await context
          .read<CubitTableOrder>()
          .importFromCodeAsNewOrder(
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

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 2),
            blurRadius: 4,
          ),
        ],
      ),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemCount: state.orders.length + 2, // Orders + QR Button + Add Button
        itemBuilder: (context, index) {
          if (index < state.orders.length) {
            final isSelected = index == state.selectedOrderIndex;
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: Text(context.t.sale.order.orderTab(n: index + 1)),
                selected: isSelected,
                onSelected: (_) =>
                    context.read<CubitTableOrder>().selectOrder(index),
              ),
            );
          } else if (index == state.orders.length) {
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ActionChip(
                avatar: const Icon(Icons.qr_code_scanner, size: 18),
                label: Text(context.t.sale.order.newOrder),
                onPressed: state.hasUnsavedChanges
                    ? () {
                        AppScaffoldMessenger.of(context).showWarning(
                          context.t.sale.order.hasUnsavedOrders,
                        );
                      }
                    : () => _scanQrForNewOrder(context),
              ),
            );
          } else {
            return ActionChip(
              avatar: const Icon(Icons.add, size: 18),
              label: Text(context.t.sale.order.newOrder),
              onPressed: state.hasUnsavedChanges
                  ? () {
                      AppScaffoldMessenger.of(context).showWarning(
                        context.t.sale.order.hasUnsavedOrders,
                      );
                    }
                  : () => context.read<CubitTableOrder>().addNewOrder(),
            );
          }
        },
      ),
    );
  }
}
