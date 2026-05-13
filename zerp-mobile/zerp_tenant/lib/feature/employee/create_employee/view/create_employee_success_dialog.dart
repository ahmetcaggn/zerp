import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class CreateEmployeeSuccessDialog extends StatelessWidget {
  const CreateEmployeeSuccessDialog({
    required this.dialogContext,
    super.key,
  });

  final BuildContext dialogContext;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Icon(
        Icons.check_circle,
        color: Colors.green,
        size: 48,
      ),
      content: Text(
        context.t.employee.create.success,
        textAlign: TextAlign.center,
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(dialogContext).pop();
          },
          child: Text(context.t.common.ok),
        ),
      ],
    );
  }
}
