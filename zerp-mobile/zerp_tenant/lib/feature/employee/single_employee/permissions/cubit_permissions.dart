import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';

@injectable
class CubitPermissions extends BaseCubit<StatePermissions>
    with LoggerMixin<CubitPermissions> {
  CubitPermissions(this._permissionService)
    : super(const StatePermissionsInitial());

  final PermissionService _permissionService;

  Future<void> loadPermissions({required String userId}) async {
    emit(const StatePermissionsLoading());
    try {
      final permissions = await _permissionService.getPermissionsOfUser(
        userId: userId,
      );
      emit(
        StatePermissionsLoaded(
          permissions: permissions.items,
          totalCount: permissions.totalCount,
        ),
      );
    } on Object catch (e) {
      log.severe('Error loading permissions: $e');
      emit(
        StatePermissionsError('Failed to load permissions: $e'),
      );
    }
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
