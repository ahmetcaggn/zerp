import 'dart:async';

import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/cubit_permissions.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

typedef PermissionTargetType =
    ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum;

@injectable
class CubitCreatePermission extends BaseCubit<StateCreatePermission>
    with LoggerMixin<CubitCreatePermission> {
  CubitCreatePermission(
    this._permissionService,
    @factoryParam this.cubitPermissions,
  ) : super(const StateCreatePermissionLoading()) {
    unawaited(_loadActions());
  }

  final PermissionService _permissionService;
  final CubitPermissions cubitPermissions;

  Future<void> _loadActions() async {
    try {
      final res = await _permissionService.getPermissionActions();
      emit(
        StateCreatePermissionLoaded(
          actionTargetTypes: res.data,
        ),
      );
    } on Object catch (e, s) {
      log.severe('Failed to load permission actions: $e', e, s);
      emit(
        StateCreatePermissionError(
          message: t.employee.details.permissionCreate.errorLoadActions(
            error: e.toString(),
          ),
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
    if (currentState is! StateCreatePermissionLoaded) return;

    emit(
      StateCreatePermissionSaving(
        actionTargetTypes: currentState.actionTargetTypes,
      ),
    );

    try {
      final permission = PermissionCreateRequestDTO(
        userId: employeeId,
        targetType: targetType,
        action: action,
        targetId: targetId,
      );
      log.info(
        'Creating permission: ${permission.toJson()}',
      );
      await _permissionService.createPermission(request: permission);
      emit(const StateCreatePermissionSuccess());
      unawaited(cubitPermissions.loadPermissions(userId: employeeId));
    } on Object catch (e, s) {
      log.severe('Failed to create permission: $e', e, s);
      emit(
        StateCreatePermissionLoaded(
          actionTargetTypes: currentState.actionTargetTypes,
        ),
      );
    }
  }
}

sealed class StateCreatePermission {
  const StateCreatePermission();
}

final class StateCreatePermissionLoading extends StateCreatePermission {
  const StateCreatePermissionLoading();
}

final class StateCreatePermissionLoaded extends StateCreatePermission {
  const StateCreatePermissionLoaded({required this.actionTargetTypes});

  final Map<String, List<PermissionTargetType>> actionTargetTypes;
}

final class StateCreatePermissionSaving extends StateCreatePermissionLoaded {
  const StateCreatePermissionSaving({required super.actionTargetTypes});
}

final class StateCreatePermissionSuccess extends StateCreatePermission {
  const StateCreatePermissionSuccess();
}

final class StateCreatePermissionError extends StateCreatePermission {
  const StateCreatePermissionError({required this.message});

  final String message;
}
