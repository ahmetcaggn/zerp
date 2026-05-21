import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_permission_viewer.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@injectable
class CubitPermissions extends BaseCubit<StatePermissions>
    with LoggerMixin<CubitPermissions> {
  CubitPermissions(
    @factoryParam this._cubitPermissionViewer,
    this._permissionService,
    this._cubitError,
  ) : super(const StatePermissionsInitial());

  final CubitPermissionViewer _cubitPermissionViewer;
  final PermissionService _permissionService;
  final CubitError _cubitError;

  Future<void> loadPermissions({required String userId}) async {
    emit(const StatePermissionsLoading());
    try {
      final permissions = await _permissionService.getPermissionsOfUser(
        userId: userId,
      );
      updatePermissions(permissions);
    } on Object catch (e) {
      log.severe('Error loading permissions: $e');
      emit(
        StatePermissionsError(
          t.employee.permissions.errorLoad(error: e.toString()),
        ),
      );
    }
  }

  Future<void> deletePermission({
    required int id,
    required String userId,
  }) async {
    try {
      await _permissionService.deletePermission(id: id);
      await loadPermissions(userId: userId);
    } on Object catch (e) {
      log.severe('Error deleting permission: $e');
      _cubitError.enqueue(
        ErrorToPresent(
          message: t.employee.permissions.errorDelete(error: e.toString()),
        ),
      );
    }
  }

  void updatePermissions(PageResponse<PermissionResponse> response) {
    emit(
      StatePermissionsLoaded(
        permissions: response.items,
        totalCount: response.totalCount,
      ),
    );
    _cubitPermissionViewer.updatePermissions(response);
  }
}

sealed class StatePermissions {
  const StatePermissions();
}

final class StatePermissionsInitial extends StatePermissions {
  const StatePermissionsInitial();
}

final class StatePermissionsLoading extends StatePermissions {
  const StatePermissionsLoading();
}

final class StatePermissionsLoaded extends StatePermissions {
  const StatePermissionsLoaded({
    required this.permissions,
    required this.totalCount,
  });

  final List<PermissionResponse> permissions;
  final int totalCount;
}

final class StatePermissionsError extends StatePermissions {
  const StatePermissionsError(this.message);

  final String message;
}
