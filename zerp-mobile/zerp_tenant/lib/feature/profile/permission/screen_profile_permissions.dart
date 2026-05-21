import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/profile/permission/cubit_profile_permissions.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenProfilePermissions extends StatelessWidget {
  const ScreenProfilePermissions({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<CubitProfilePermissions>();
        unawaited(cubit.loadPermissions());
        return cubit;
      },
      child: const _ProfilePermissionsView(),
    );
  }
}

class _ProfilePermissionsView extends StatelessWidget {
  const _ProfilePermissionsView();

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: context.t.profile.permissions.title,
      body: BlocBuilder<CubitProfilePermissions, StateProfilePermissions>(
        builder: (context, state) {
          return switch (state) {
            StateProfilePermissionsInitial() ||
            StateProfilePermissionsLoading() => const Center(
              child: CircularProgressIndicator(),
            ),
            StateProfilePermissionsError(:final message) => Center(
              child: Text(message),
            ),
            StateProfilePermissionsLoaded(:final permissions) => _ListSection(
              permissions: permissions,
            ),
          };
        },
      ),
    );
  }
}

class _ListSection extends StatelessWidget {
  const _ListSection({required this.permissions});

  final List<PermissionResponse> permissions;

  @override
  Widget build(BuildContext context) {
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
                context.t.profile.permissions.total(count: permissions.length),
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
              context.t.profile.permissions.empty,
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
              ),
            ),
          ),
      ],
    );
  }
}

class _PermissionEntry extends StatelessWidget {
  const _PermissionEntry({required this.permission});

  final PermissionResponse permission;

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
          color: Theme.of(context).colorScheme.outlineVariant,
        ),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 8,
        ),
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).colorScheme.secondaryContainer,
          child: Icon(
            Icons.security,
            color: Theme.of(context).colorScheme.onSecondaryContainer,
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
            Text(context.t.profile.permissions.target(targetType: targetType)),
            if (targetId != null && targetId.isNotEmpty)
              Text(context.t.profile.permissions.id(targetId: targetId)),
          ],
        ),
      ),
    );
  }
}
