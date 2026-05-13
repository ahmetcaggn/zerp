import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/profile/cubit/permission/state_profile_permissions.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';

@injectable
class CubitProfilePermissions extends BaseCubit<StateProfilePermissions>
    with LoggerMixin<CubitProfilePermissions> {
  CubitProfilePermissions(this._permissionService)
    : super(const StateProfilePermissionsInitial());

  final PermissionService _permissionService;

  Future<void> loadPermissions() async {
    emit(const StateProfilePermissionsLoading());
    try {
      final permissions = await _permissionService.getAllOwnedPermissions();
      emit(StateProfilePermissionsLoaded(permissions: permissions.items));
    } on Object catch (e) {
      log.severe('Error loading permissions: $e');
      emit(
        StateProfilePermissionsError(message: 'Failed to load permissions: $e'),
      );
    }
  }
}
