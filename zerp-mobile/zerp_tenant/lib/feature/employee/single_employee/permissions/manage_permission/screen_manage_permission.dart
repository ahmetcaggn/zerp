import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_permission_viewer.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/cubit_permissions.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/manage_permission/cubit/cubit_manage_permission.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/manage_permission/view/view_manage_permission_action_selector.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/manage_permission/view/view_manage_permission_target_selector.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

part 'mixin/mixin_manage_permission.dart';

typedef PermissionTargetType =
    ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum;

@RoutePage()
class ScreenManagePermission extends StatelessWidget {
  const ScreenManagePermission({
    required this.employeeId,
    required this.cubitPermission,
    required this.cubitPermissionViewer,
    super.key,
  });

  final String employeeId;
  final CubitPermissions cubitPermission;
  final CubitPermissionViewer cubitPermissionViewer;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<CubitManagePermission>(
        param1: cubitPermission,
        param2: cubitPermissionViewer,
      ),
      child: _ManagePermissionView(employeeId: employeeId),
    );
  }
}

class _ManagePermissionView extends StatefulWidget {
  const _ManagePermissionView({required this.employeeId});

  final String employeeId;

  @override
  State<_ManagePermissionView> createState() => _ManagePermissionViewState();
}

class _ManagePermissionViewState extends State<_ManagePermissionView>
    with _MixinManagePermission {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(context.t.permissionManage.title),
      ),
      body: BlocConsumer<CubitManagePermission, StateManagePermission>(
        listener: _listener,
        builder: (context, state) {
          if (state is StateManagePermissionLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is StateManagePermissionError &&
              state is! StateManagePermissionLoaded) {
            return Center(
              child: Text(state.message),
            );
          }

          final isSaving = state is StateManagePermissionSaving;

          var actionMap = <String, List<PermissionTargetType>>{};
          if (state is StateManagePermissionLoaded) {
            actionMap = state.actionTargetTypes;
          }

          final availableActions = actionMap.keys.toList();
          final availableTargetTypes = selectedActionStr != null
              ? (actionMap[selectedActionStr] ?? [])
              : <PermissionTargetType>[];

          return Padding(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: formKey,
              child: ListView(
                children: [
                  TextFormField(
                    key: ValueKey(selectedActionStr),
                    initialValue: selectedActionStr,
                    readOnly: true,
                    decoration: InputDecoration(
                      labelText: context.t.permissionManage.action,
                      suffixIcon: const Icon(Icons.arrow_drop_down),
                    ),
                    onTap: () {
                      unawaited(
                        showModalBottomSheet<void>(
                          context: context,
                          isScrollControlled: true,
                          useSafeArea: true,
                          builder: (context) {
                            return ViewManagePermissionActionSelector(
                              actions: availableActions,
                              initialAction: selectedActionStr,
                              onSelected: (value) {
                                setState(() {
                                  selectedActionStr = value;
                                  selectedTargetType = null;
                                  targetIdController.clear();
                                });
                              },
                            );
                          },
                        ),
                      );
                    },
                    validator: (val) =>
                        val == null ? context.t.common.required : null,
                  ),
                  const SizedBox(height: 16),

                  if (selectedActionStr != null) ...[
                    DropdownButtonFormField<PermissionTargetType>(
                      initialValue: selectedTargetType,
                      decoration: InputDecoration(
                        labelText: context.t.permissionManage.targetType,
                      ),
                      items: availableTargetTypes.map((type) {
                        return DropdownMenuItem(
                          value: type,
                          child: Text(type.value),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          selectedTargetType = value;
                          targetIdController.clear();
                        });
                      },
                      validator: (val) =>
                          val == null ? context.t.common.required : null,
                    ),

                    if (selectedTargetType != null) ...[
                      const SizedBox(height: 16),
                      ViewManagePermissionTargetSelector(
                        targetIdController: targetIdController,
                        selectedTargetType: selectedTargetType!,
                      ),
                    ],
                    const SizedBox(height: 32),
                  ],

                  ElevatedButton(
                    onPressed: (isSaving || selectedActionStr == null)
                        ? null
                        : submit,
                    child: isSaving
                        ? const CircularProgressIndicator()
                        : Text(context.t.permissionManage.submit),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
