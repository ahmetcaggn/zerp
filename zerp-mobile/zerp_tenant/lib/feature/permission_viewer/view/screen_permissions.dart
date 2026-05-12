import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/permission_viewer/cubit/cubit_permission_view.dart';
import 'package:zerp_tenant/feature/permission_viewer/cubit/state_permission_view.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenPermissions extends StatefulWidget {
  const ScreenPermissions({super.key});

  @override
  State<ScreenPermissions> createState() => _ScreenPermissionsState();
}

class _ScreenPermissionsState extends State<ScreenPermissions> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<CubitPermissionView>();
        unawaited(cubit.loadPermissions());
        return cubit;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(context.t.permissionViewer.title),
        ),
        body: BlocBuilder<CubitPermissionView, StatePermissionView>(
          builder: (context, state) {
            return switch (state) {
              StatePermissionViewInitial() || StatePermissionViewLoading() =>
                const Center(child: CircularProgressIndicator()),
              StatePermissionViewError(:final message) => Center(
                child: Text(message),
              ),
              StatePermissionViewLoaded(
                :final permissions,
                :final totalCount,
              ) =>
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        context.t.permissionViewer.total(count: totalCount),
                      ),
                    ),
                    if (permissions.isEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(context.t.permissionViewer.empty),
                      )
                    else
                      Expanded(
                        child: ListView.separated(
                          itemCount: permissions.length,
                          separatorBuilder: (_, __) => const Divider(height: 1),
                          itemBuilder: (context, index) {
                            final permission = permissions[index];
                            final action = permission.action?.value ?? '-';
                            final targetType =
                                permission.targetType?.value ?? '-';
                            final targetId = permission.targetId ?? '-';
                            return ListTile(
                              title: Text('$action - $targetType'),
                              subtitle: Text(targetId),
                            );
                          },
                        ),
                      ),
                  ],
                ),
            };
          },
        ),
      ),
    );
  }
}
