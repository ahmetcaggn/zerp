import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class DiscardChangesConfirmDialog extends StatelessWidget {
  const DiscardChangesConfirmDialog({super.key});

  static Future<bool?> show(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (context) => const DiscardChangesConfirmDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(t.sale.order.discardDialog.title),
      content: Text(
        t.sale.order.discardDialog.message,
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: Text(t.sale.order.discardDialog.cancel),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
          onPressed: () => Navigator.of(context).pop(true),
          child: Text(
            t.sale.order.discardDialog.confirm,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onError,
            ),
          ),
        ),
      ],
    );
  }
}
