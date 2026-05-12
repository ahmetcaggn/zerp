import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/permission_viewer/cubit/cubit_permission_view.dart';
import 'package:zerp_tenant/feature/permission_viewer/cubit/state_permission_view.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class PermissionsViewer extends StatelessWidget {
  const PermissionsViewer({super.key});

  static const int _previewCount = 3;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt.get<CubitPermissionView>();
        unawaited(
          cubit.loadPermissions(
            pageRequest: const PageRequest(start: 0, end: _previewCount),
          ),
        );
        return cubit;
      },
      child: BlocBuilder<CubitPermissionView, StatePermissionView>(
        builder: (context, state) {
          return switch (state) {
            StatePermissionViewInitial() ||
            StatePermissionViewLoading() => const Center(
              child: CircularProgressIndicator(),
            ),
            StatePermissionViewError(:final message) => Text(message),
            StatePermissionViewLoaded(
              :final permissions,
              :final totalCount,
            ) =>
              _PermissionsSummary(
                permissions: permissions.take(_previewCount).toList(),
                totalCount: totalCount,
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
  });

  final List<PermissionResponse> permissions;
  final int totalCount;

  String _permissionLabel(PermissionResponse permission) {
    final action = permission.action?.value ?? '-';
    final targetType = permission.targetType?.value ?? '-';
    return '$action - $targetType';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(context.t.widgets.permissionViewer.title),
        const SizedBox(height: 8),
        Text(context.t.widgets.permissionViewer.total(count: totalCount)),
        const SizedBox(height: 8),
        if (permissions.isEmpty)
          Text(context.t.widgets.permissionViewer.empty)
        else
          ...permissions.map(
            (permission) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 2),
              child: Text(_permissionLabel(permission)),
            ),
          ),
        const SizedBox(height: 8),
        Align(
          alignment: Alignment.centerLeft,
          child: TextButton(
            onPressed: () => context.router.push(const RoutePermissions()),
            child: Text(context.t.widgets.permissionViewer.manage),
          ),
        ),
      ],
    );
  }
}
