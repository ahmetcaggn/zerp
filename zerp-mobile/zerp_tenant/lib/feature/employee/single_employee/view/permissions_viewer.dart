import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_permission_viewer.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class PermissionsViewer extends StatelessWidget {
  const PermissionsViewer({
    required this.employeeId,
    super.key,
  });

  final String employeeId;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt.get<CubitPermissionViewer>();
        unawaited(
          cubit.loadPermissions(userId: employeeId),
        );
        return cubit;
      },
      child: BlocBuilder<CubitPermissionViewer, StatePermissionViewer>(
        builder: (context, state) {
          return switch (state) {
            StatePermissionViewerInitial() ||
            StatePermissionViewerLoading() => const Center(
              child: CircularProgressIndicator(),
            ),
            StatePermissionViewerError(:final message) => Text(message),
            StatePermissionViewerLoaded(
              :final permissions,
              :final totalCount,
            ) =>
              _PermissionsSummary(
                permissions: permissions.take(permissions.length).toList(),
                totalCount: totalCount,
                employeeId: employeeId,
              ),
          };
        },
      ),
    );
  }
}

class _PermissionsSummary extends StatelessWidget {
  const _PermissionsSummary({
    required this.permissions,
    required this.totalCount,
    required this.employeeId,
  });

  final List<PermissionResponse> permissions;
  final int totalCount;
  final String employeeId;

  String _permissionLabel(PermissionResponse permission) {
    final action = permission.action?.value ?? '-';
    final targetType = permission.targetType?.value ?? '-';
    return '$action - $targetType';
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Theme.of(context).colorScheme.outlineVariant),
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
                    context.t.employee.permissionViewer.title,
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
                    context.t.employee.permissionViewer.total(
                      count: totalCount,
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
                  context.t.employee.permissionViewer.empty,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              )
            else
              ...permissions.map(
                (permission) => Padding(
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
                ),
              ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => context.router.push(
                  RoutePermissions(
                    employeeId: employeeId,
                    cubitPermissionViewer: context
                        .read<CubitPermissionViewer>(),
                  ),
                ),
                child: Text(context.t.employee.permissionViewer.manage),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
