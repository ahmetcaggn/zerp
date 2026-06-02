import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class LoggingOutDialog extends StatefulWidget {
  const LoggingOutDialog({super.key});

  static Future<void> show(BuildContext context) {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (context) => const LoggingOutDialog(),
    );
  }

  @override
  State<LoggingOutDialog> createState() => _LoggingOutDialogState();
}

class _LoggingOutDialogState extends State<LoggingOutDialog> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return PopScope(
      canPop: !_isLoading,
      child: AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: _isLoading
            ? Row(
                children: [
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      context.t.auth.logoutDialog.loading,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              )
            : Text(
                context.t.auth.logoutDialog.title,
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
        content: _isLoading
            ? null
            : Text(
                context.t.auth.logoutDialog.message,
                style: theme.textTheme.bodyMedium,
              ),
        actions: _isLoading
            ? null
            : [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: Text(context.t.auth.logoutDialog.cancel),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.error,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () async {
                    final navigator = Navigator.of(context);
                    final cubitAuth = context.read<CubitAuth>();
                    setState(() {
                      _isLoading = true;
                    });
                    try {
                      await cubitAuth.logout();
                    } finally {
                      if (mounted) {
                        navigator.pop();
                      }
                    }
                  },
                  child: Text(
                    context.t.auth.logoutDialog.confirm,
                    style: TextStyle(
                      color: theme.colorScheme.onError,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
      ),
    );
  }
}
