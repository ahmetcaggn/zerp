import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/widget/permission/permission_scope.dart';

/// Conditionally shows [child] based on whether the authenticated user holds
/// [action] in their permission tree.
///
/// When the user **has** [action]: renders [child].
/// When the user **does not have** [action]: renders [fallback]
/// (defaults to [SizedBox.shrink]).
///
/// Example:
/// ```dart
/// PermissionGuard(
///   action: PermittableAction.CREATE_EMPLOYEE,
///   child: ElevatedButton(
///     onPressed: _createEmployee,
///     child: const Text('Create Employee'),
///   ),
/// )
/// ```
class PermissionGuard extends StatelessWidget {
  const PermissionGuard({
    required this.action,
    required this.child,
    this.fallback,
    super.key,
  });

  /// The action the user must hold for [child] to be rendered.
  final PermittableAction action;

  /// Widget to show when the user has [action].
  final Widget child;

  /// Widget to show when the user does not have [action].
  /// Defaults to [SizedBox.shrink].
  final Widget? fallback;

  @override
  Widget build(BuildContext context) {
    final permitted = PermissionScope.hasAction(context, action);
    return permitted ? child : (fallback ?? const SizedBox.shrink());
  }
}
