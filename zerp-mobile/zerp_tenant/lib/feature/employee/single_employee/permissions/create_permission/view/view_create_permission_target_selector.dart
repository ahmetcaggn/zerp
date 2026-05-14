import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/create_permission/view/view_permittable_list_selector.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';
import 'package:zerp_tenant/product/util/constants.dart';

typedef PermissionTargetType =
    ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum;

class ViewCreatePermissionTargetSelector extends StatefulWidget {
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
  State<ViewCreatePermissionTargetSelector> createState() =>
      _ViewCreatePermissionTargetSelectorState();
}

class _ViewCreatePermissionTargetSelectorState
    extends State<ViewCreatePermissionTargetSelector> {
  late List<PermissionTargetType> hierarchy;
  final Map<PermissionTargetType, String> selectedIds = {};
  final Map<PermissionTargetType, String> selectedTitles = {};

  @override
  void initState() {
    super.initState();
    _updateHierarchy();
  }

  @override
  void didUpdateWidget(ViewCreatePermissionTargetSelector oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedTargetType != widget.selectedTargetType ||
        !listEquals(oldWidget.allowedTargetTypes, widget.allowedTargetTypes)) {
      _updateHierarchy();
    }
  }

  void _updateHierarchy() {
    // The API returns hierarchy in order [min, ..., top]
    // We find our selectedTargetType in the list and take everything from there
    // to the end
    final index = widget.allowedTargetTypes.indexOf(widget.selectedTargetType);
    if (index != -1) {
      final fullHierarchy = widget.allowedTargetTypes
          .sublist(index)
          .reversed
          .toList();
      // Filter out TENANT_ROOT
      hierarchy = fullHierarchy
          .where((type) => type != PermissionTargetType.TENANT_ROOT)
          .toList();

      // If the selected target type itself is TENANT_ROOT, set the hardcoded ID
      if (widget.selectedTargetType == PermissionTargetType.TENANT_ROOT) {
        widget.targetIdController.text = kTenantRootId;
      }
    } else {
      hierarchy = [widget.selectedTargetType];
    }
    selectedIds.clear();
    selectedTitles.clear();
    if (widget.selectedTargetType != PermissionTargetType.TENANT_ROOT) {
      widget.targetIdController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: hierarchy.map(_buildLevelSelector).toList(),
    );
  }

  Widget _buildLevelSelector(PermissionTargetType type) {
    final index = hierarchy.indexOf(type);
    final isEnabled =
        index == 0 || selectedIds.containsKey(hierarchy[index - 1]);
    final parentId = index == 0 ? null : selectedIds[hierarchy[index - 1]];

    final isSelected = selectedIds.containsKey(type);
    final title = selectedTitles[type] ?? '';
    final id = selectedIds[type] ?? '';

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        key: ValueKey('${type.value}_$id'),
        initialValue: isSelected ? '$title ($id)' : null,
        readOnly: true,
        enabled: isEnabled,
        decoration: InputDecoration(
          labelText: type.value,
          suffixIcon: const Icon(Icons.arrow_drop_down),
          hintText: context.t.common.select,
        ),
        onTap: isEnabled
            ? () {
                unawaited(
                  showModalBottomSheet<void>(
                    context: context,
                    isScrollControlled: true,
                    useSafeArea: true,
                    builder: (context) {
                      return ViewPermittableListSelector(
                        targetType: type,
                        parentId: parentId,
                        onSelected: (permittable) {
                          setState(() {
                            selectedIds[type] = permittable.id ?? '';
                            selectedTitles[type] = permittable.title ?? '';

                            // Clear child levels
                            for (var i = index + 1; i < hierarchy.length; i++) {
                              selectedIds.remove(hierarchy[i]);
                              selectedTitles.remove(hierarchy[i]);
                            }

                            // Update final target ID if this is the last level
                            if (type == widget.selectedTargetType) {
                              widget.targetIdController.text =
                                  permittable.id ?? '';
                            } else {
                              widget.targetIdController.clear();
                            }
                          });
                          Navigator.pop(context);
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
