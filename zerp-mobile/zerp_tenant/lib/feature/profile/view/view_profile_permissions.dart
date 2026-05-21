import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:openapi_user/model/permission_response.dart';
import 'package:zerp_tenant/feature/profile/cubit/cubit_view_profile_permissions.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class ViewProfilePermissions extends StatelessWidget {
  const ViewProfilePermissions({
    required this.state,
    super.key,
  });

  final StateViewProfilePermissions state;

  @override
  Widget build(BuildContext context) {
    final state = this.state;
    return Padding(
      padding: const EdgeInsets.all(16),
      child: switch (state) {
        StateViewProfilePermissionsInitial() ||
        StateViewProfilePermissionsLoading() => const Center(
          child: CircularProgressIndicator(),
        ),
        StateViewProfilePermissionsError(:final message) => Center(
          child: Text(message),
        ),
        StateViewProfilePermissionsLoaded() => _LoadedView(state: state),
      },
    );
  }
}

final class _LoadedView extends StatelessWidget {
  const _LoadedView({required this.state});

  final StateViewProfilePermissionsLoaded state;

  @override
  Widget build(BuildContext context) {
    final permissions = state.permissions;
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(context).colorScheme.outlineVariant,
        ),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.admin_panel_settings_outlined,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    context.t.profile.permissions.title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    context.t.profile.permissions.total(
                      count: state.totalCount,
                    ),
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (permissions.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Text(
                  context.t.profile.permissions.empty,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
            ...permissions.map(
              (permission) => _PermissionEntry(permission: permission),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () =>
                    context.router.push(const RouteProfilePermissions()),
                child: Text(
                  context.t.profile.permissions.viewAll,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

final class _PermissionEntry extends StatelessWidget {
  const _PermissionEntry({required this.permission});

  final PermissionResponse permission;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(
            Icons.check,
            size: 16,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              _permissionLabel(permission),
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }

  String _permissionLabel(PermissionResponse permission) {
    final action = permission.action?.value ?? '-';
    final targetType = permission.targetType?.value ?? '-';
    return '$action - $targetType';
  }
}
