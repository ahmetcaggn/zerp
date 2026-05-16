import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/create_permission/cubit/cubit_create_permission_target.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/create_permission/view/view_permittable_list_selector.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

typedef PermissionTargetType =
    ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum;

class ViewCreatePermissionTargetSelector extends StatelessWidget {
  const ViewCreatePermissionTargetSelector({
    required this.targetIdController,
    required this.selectedTargetType,
    required this.allowedTargetTypes,
    super.key,
  });

  final PermissionTargetType selectedTargetType;
  final List<PermissionTargetType> allowedTargetTypes;
  final TextEditingController targetIdController;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<CubitCreatePermissionTarget>()
        ..init(
          selectedTargetType: selectedTargetType,
          allowedTargetTypes: allowedTargetTypes,
        ),
      child:
          BlocConsumer<
            CubitCreatePermissionTarget,
            StateCreatePermissionTarget
          >(
            listenWhen: (prev, curr) =>
                prev.finalTargetId != curr.finalTargetId,
            listener: (context, state) {
              targetIdController.text = state.finalTargetId ?? '';
            },
            builder: (context, state) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: state.hierarchy
                    .map(
                      (type) => _buildLevelSelector(context, type, state),
                    )
                    .toList(),
              );
            },
          ),
    );
  }

  Widget _buildLevelSelector(
    BuildContext context,
    PermissionTargetType type,
    StateCreatePermissionTarget state,
  ) {
    final index = state.hierarchy.indexOf(type);
    final isEnabled =
        index == 0 || state.selectedIds.containsKey(state.hierarchy[index - 1]);
    final parentId = index == 0
        ? null
        : state.selectedIds[state.hierarchy[index - 1]];

    final isSelected = state.selectedIds.containsKey(type);
    final title = state.selectedTitles[type] ?? '';
    final id = state.selectedIds[type] ?? '';
    final isLoading = state.loadingLevels.contains(type);

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        key: ValueKey('${type.value}_$id'),
        initialValue: isSelected ? '$title ($id)' : null,
        readOnly: true,
        enabled: isEnabled,
        decoration: InputDecoration(
          labelText: type.value,
          suffixIcon: isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                )
              : const Icon(Icons.arrow_drop_down),
          hintText: context.t.common.select,
        ),
        onTap: isEnabled && !isLoading
            ? () {
                unawaited(
                  showModalBottomSheet<void>(
                    context: context,
                    isScrollControlled: true,
                    useSafeArea: true,
                    builder: (sheetContext) {
                      return ViewPermittableListSelector(
                        targetType: type,
                        parentId: parentId,
                        onSelected: (permittable) {
                          context
                              .read<CubitCreatePermissionTarget>()
                              .selectTarget(type, permittable);
                          Navigator.pop(sheetContext);
                        },
                      );
                    },
                  ),
                );
              }
            : null,
        validator: (val) =>
            (val == null || val.isEmpty) ? context.t.common.required : null,
      ),
    );
  }
}
