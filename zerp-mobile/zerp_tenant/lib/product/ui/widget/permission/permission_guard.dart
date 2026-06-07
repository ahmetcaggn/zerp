import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/widget/permission/permission_scope.dart';

/// Conditionally shows, hides, or disables [child] based on whether the
/// authenticated user holds [action] in their permission tree.
///
/// **Permitted**: renders [child] normally.
///
/// **Not permitted, `hideIfUnpermitted: true`** (default):
/// renders [fallback] or [SizedBox.shrink].
///
/// **Not permitted, `hideIfUnpermitted: false`**:
/// renders [child] greyed-out and non-interactive, with an optional
/// [disabledTooltip] explaining why it is disabled.
///
/// Example — hide:
/// ```dart
/// PermissionGuard(
///   action: PermittableAction.CREATE_EMPLOYEE,
///   child: ElevatedButton(onPressed: _create, child: Text('Add')),
/// )
/// ```
///
/// Example — grey out with tooltip:
/// ```dart
/// PermissionGuard(
///   action: PermittableAction.CREATE_EMPLOYEE,
///   hideIfUnpermitted: false,
///   disabledTooltip: 'You need CREATE_EMPLOYEE permission',
///   child: ElevatedButton(onPressed: _create, child: Text('Add')),
/// )
/// ```
class PermissionGuard extends StatelessWidget {
  const PermissionGuard({
    required this.action,
    required this.child,
    this.fallback,
    this.hideIfUnpermitted = true,
    this.disabledTooltip,
    super.key,
  });

  /// The action the user must hold for [child] to be rendered normally.
  final PermittableAction action;

  /// Widget to render when the user has [action].
  final Widget child;

  /// Widget to render when the user lacks [action] AND
  /// [hideIfUnpermitted] is `true`.
  /// Defaults to [SizedBox.shrink].
  final Widget? fallback;

  /// When `true` (default), the widget is fully hidden when not permitted.
  /// When `false`, the widget is rendered greyed-out and non-interactive.
  final bool hideIfUnpermitted;

  /// Tooltip text shown on long-press when [hideIfUnpermitted] is `false`
  /// and the user lacks [action].
  final String? disabledTooltip;

  @override
  Widget build(BuildContext context) {
    final orgState = context.watch<CubitOrganizationScope>().state;
    String? targetId;
    if (orgState is StateOrganizationScopeShop) {
      targetId = orgState.shop.id;
    } else if (orgState is StateOrganizationScopeTenant) {
      targetId = orgState.tenant.id;
    }

    final permitted = PermissionScope.hasActionInScope(
      context,
      action,
      targetId,
    );

    if (permitted) return child;

    if (hideIfUnpermitted) {
      return fallback ?? const SizedBox.shrink();
    }

    // Visible but disabled — greyed out and non-interactive.
    return Tooltip(
      message: disabledTooltip ?? '',
      child: Opacity(
        opacity: 0.38, // Material disabled opacity
        child: IgnorePointer(child: child),
      ),
    );
  }
}
