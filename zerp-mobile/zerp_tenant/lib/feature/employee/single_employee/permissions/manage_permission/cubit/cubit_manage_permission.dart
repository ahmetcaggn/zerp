import 'dart:async';

import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_permission_viewer.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/cubit_permissions.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

typedef PermissionTargetType =
    ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum;

@injectable
class CubitManagePermission extends BaseCubit<StateManagePermission>
    with LoggerMixin<CubitManagePermission> {
  CubitManagePermission(
    this._permissionService,
    @factoryParam this.cubitPermissions,
    @factoryParam this.cubitPermissionViewer,
  ) : super(const StateManagePermissionLoading()) {
    unawaited(_loadActions());
  }

  final PermissionService _permissionService;
  final CubitPermissions cubitPermissions;
  final CubitPermissionViewer cubitPermissionViewer;

  Future<void> _loadActions() async {
    try {
      final res = await _permissionService.getPermissionActions();
      emit(
        StateManagePermissionLoaded(
          actionTargetTypes: res.data,
        ),
      );
    } on Object catch (e, s) {
      log.severe('Failed to load permission actions: $e', e, s);
      emit(
        StateManagePermissionError(
          message: t.permissionManage.errorLoadActions(error: e.toString()),
        ),
      );
    }
  }

  Future<void> savePermission({
    required String employeeId,
    required PermissionCreateRequestDTOTargetTypeEnum targetType,
    required PermissionCreateRequestDTOActionEnum action,
    String? targetId,
  }) async {
    final currentState = state;
    if (currentState is! StateManagePermissionLoaded) return;

    emit(
      StateManagePermissionSaving(
        actionTargetTypes: currentState.actionTargetTypes,
      ),
    );

    try {
      await _permissionService.createPermission(
        request: PermissionCreateRequestDTO(
          userId: employeeId,
          targetType: targetType,
          action: action,
          targetId: targetId,
        ),
      );
      emit(const StateManagePermissionSuccess());
      unawaited(cubitPermissions.loadPermissions(userId: employeeId));
      unawaited(cubitPermissionViewer.loadPermissions(userId: employeeId));
    } on Object catch (e, s) {
      log.severe('Failed to create permission: $e', e, s);
      emit(
        StateManagePermissionLoaded(
          actionTargetTypes: currentState.actionTargetTypes,
        ),
      );
    }
  }
}

sealed class StateManagePermission {
  const StateManagePermission();
}

final class StateManagePermissionLoading extends StateManagePermission {
  const StateManagePermissionLoading();
}

final class StateManagePermissionLoaded extends StateManagePermission {
  const StateManagePermissionLoaded({required this.actionTargetTypes});

  final Map<String, List<PermissionTargetType>> actionTargetTypes;
}

final class StateManagePermissionSaving extends StateManagePermissionLoaded {
  const StateManagePermissionSaving({required super.actionTargetTypes});
}

final class StateManagePermissionSuccess extends StateManagePermission {
  const StateManagePermissionSuccess();
}

final class StateManagePermissionError extends StateManagePermission {
  const StateManagePermissionError({required this.message});

  final String message;
}
