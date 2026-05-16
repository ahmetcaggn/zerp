import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_permission_viewer.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/cubit_permissions.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenPermissions extends StatefulWidget {
  const ScreenPermissions({
    required this.employeeId,
    required this.cubitPermissionViewer,
    super.key,
  });

  final String employeeId;
  final CubitPermissionViewer cubitPermissionViewer;

  @override
  State<ScreenPermissions> createState() => _ScreenPermissionsState();
}

class _ScreenPermissionsState extends State<ScreenPermissions> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<CubitPermissions>(
          param1: widget.cubitPermissionViewer,
        );
        unawaited(cubit.loadPermissions(userId: widget.employeeId));
        return cubit;
      },
      child: _PermissionsView(
        employeeId: widget.employeeId,
        cubitPermissionViewer: widget.cubitPermissionViewer,
      ),
    );
  }
}

class _PermissionsView extends StatelessWidget {
  const _PermissionsView({
    required this.employeeId,
    required this.cubitPermissionViewer,
  });

  final String employeeId;
  final CubitPermissionViewer cubitPermissionViewer;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(context.t.permissionViewer.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              final cubit = context.read<CubitPermissions>();
              unawaited(
                context.router.push(
                  RouteCreatePermission(
                    employeeId: employeeId,
                    cubitPermission: cubit,
                    cubitPermissionViewer: cubitPermissionViewer,
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: BlocBuilder<CubitPermissions, StatePermissions>(
        builder: (context, state) {
          return switch (state) {
            StatePermissionsInitial() || StatePermissionsLoading() =>
              const Center(child: CircularProgressIndicator()),
            StatePermissionsError(:final message) => Center(
              child: Text(message),
            ),
            StatePermissionsLoaded() => _ListSection(
              state: state,
              employeeId: employeeId,
            ),
          };
        },
      ),
    );
  }
}

class _ListSection extends StatelessWidget {
  const _ListSection({
    required this.state,
    required this.employeeId,
  });

  final StatePermissionsLoaded state;
  final String employeeId;

  @override
  Widget build(BuildContext context) {
    final permissions = state.permissions;
    final totalCount = state.totalCount;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Icon(
                Icons.admin_panel_settings_outlined,
                color: Theme.of(context).colorScheme.primary,
              ),
              const SizedBox(width: 8),
              Text(
                context.t.permissionViewer.total(count: totalCount),
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        if (permissions.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              context.t.permissionViewer.empty,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontStyle: FontStyle.italic,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
          )
        else
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 8,
              ),
              itemCount: permissions.length,
              itemBuilder: (context, index) => _PermissionEntry(
                permission: permissions[index],
                employeeId: employeeId,
              ),
            ),
          ),
      ],
    );
  }
}

class _PermissionEntry extends StatelessWidget {
  const _PermissionEntry({
    required this.permission,
    required this.employeeId,
  });

  final PermissionResponse permission;
  final String employeeId;

  @override
  Widget build(BuildContext context) {
    final action = permission.action?.value ?? '-';
    final targetType = permission.targetType?.value ?? '-';
    final targetId = permission.targetId;

    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(
            context,
          ).colorScheme.outlineVariant,
        ),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 8,
        ),
        leading: CircleAvatar(
          backgroundColor: Theme.of(
            context,
          ).colorScheme.secondaryContainer,
          child: Icon(
            Icons.security,
            color: Theme.of(
              context,
            ).colorScheme.onSecondaryContainer,
          ),
        ),
        title: Text(
          action,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(context.t.permissionViewer.target(targetType: targetType)),
            if (targetId != null && targetId.isNotEmpty)
              Text(context.t.permissionViewer.id(targetId: targetId)),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.delete_outline),
          color: Theme.of(context).colorScheme.error,
          onPressed: () async {
            final confirm = await showDialog<bool>(
              context: context,
              builder: (context) => AlertDialog(
                title: Text(context.t.permissionViewer.deleteTitle),
                content: Text(
                  context.t.permissionViewer.deleteMessage,
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context, false),
                    child: Text(context.t.common.cancel),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context, true),
                    style: TextButton.styleFrom(
                      foregroundColor: Theme.of(context).colorScheme.error,
                    ),
                    child: Text(context.t.common.delete),
                  ),
                ],
              ),
            );

            if (confirm == true && permission.id != null && context.mounted) {
              await context.read<CubitPermissions>().deletePermission(
                id: permission.id!,
                userId: employeeId,
              );
            }
          },
        ),
      ),
    );
  }
}
