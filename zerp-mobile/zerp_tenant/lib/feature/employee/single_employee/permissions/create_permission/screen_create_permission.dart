import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_permission_viewer.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/create_permission/cubit/cubit_create_permission.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/create_permission/view/view_create_permission_action_selector.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/create_permission/view/view_create_permission_target_selector.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/cubit_permissions.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold_messenger.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

part 'mixin/mixin_create_permission.dart';

typedef PermissionTargetType =
    ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum;

@RoutePage()
class ScreenCreatePermission extends StatelessWidget {
  const ScreenCreatePermission({
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
      create: (context) =>
          getIt<CubitCreatePermission>(param1: cubitPermission),
      child: _CreatePermissionView(employeeId: employeeId),
    );
  }
}

class _CreatePermissionView extends StatefulWidget {
  const _CreatePermissionView({required this.employeeId});

  final String employeeId;

  @override
  State<_CreatePermissionView> createState() => _CreatePermissionViewState();
}

class _CreatePermissionViewState extends State<_CreatePermissionView>
    with _MixinCreatePermission {
  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: context.t.employee.details.permissionCreate.title,
      body: BlocConsumer<CubitCreatePermission, StateCreatePermission>(
        listener: _listener,
        builder: (context, state) {
          if (state is StateCreatePermissionLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is StateCreatePermissionError &&
              state is! StateCreatePermissionLoaded) {
            return Center(
              child: Text(state.message),
            );
          }

          final isSaving = state is StateCreatePermissionSaving;

          var actionMap = <String, List<PermissionTargetType>>{};
          if (state is StateCreatePermissionLoaded) {
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
                      labelText:
                          context.t.employee.details.permissionCreate.action,
                      suffixIcon: const Icon(Icons.arrow_drop_down),
                    ),
                    onTap: () {
                      unawaited(
                        showModalBottomSheet<void>(
                          context: context,
                          isScrollControlled: true,
                          useSafeArea: true,
                          builder: (context) {
                            return ViewCreatePermissionActionSelector(
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
                        labelText: context
                            .t
                            .employee
                            .details
                            .permissionCreate
                            .targetType,
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
                      ViewCreatePermissionTargetSelector(
                        key: ValueKey(selectedTargetType),
                        targetIdController: targetIdController,
                        selectedTargetType: selectedTargetType!,
                        allowedTargetTypes: availableTargetTypes,
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
                        : Text(
                            context.t.employee.details.permissionCreate.submit,
                          ),
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
