import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class CancelOrderConfirmDialog extends StatelessWidget {
  const CancelOrderConfirmDialog({super.key});

  static Future<bool?> show(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (context) => const CancelOrderConfirmDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(t.sale.order.cancelDialog.title),
      content: Text(
        t.sale.order.cancelDialog.message,
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: Text(t.sale.order.cancelDialog.cancel),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
          onPressed: () => Navigator.of(context).pop(true),
          child: Text(
            t.sale.order.cancelDialog.confirm,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onError,
            ),
          ),
        ),
      ],
    );
  }
}
