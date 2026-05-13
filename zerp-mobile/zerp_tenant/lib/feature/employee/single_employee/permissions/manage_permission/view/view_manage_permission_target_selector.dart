import 'package:flutter/material.dart';
import 'package:openapi_user/model/api_response_map_permission_action_list_permission_target_type.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

typedef PermissionTargetType =
    ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum;

class ViewManagePermissionTargetSelector extends StatelessWidget {
  const ViewManagePermissionTargetSelector({
    required this.targetIdController,
    required this.selectedTargetType,
    super.key,
  });

  final PermissionTargetType selectedTargetType;
  final TextEditingController targetIdController;

  @override
  Widget build(BuildContext context) {
    switch (selectedTargetType) {
      case PermissionTargetType.USER:
      case PermissionTargetType.EMPLOYEE:
      case PermissionTargetType.TENANT:
      // ignore: no_default_cases default case is really useful.
      default:
        return TextFormField(
          controller: targetIdController,
          decoration: InputDecoration(
            labelText: context.t.permissionManage.targetId,
            hintText: context.t.permissionManage.targetIdHint(
              type: selectedTargetType.value,
            ),
          ),
        );
    }
  }
}
