import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

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
      emit(
        StateProfilePermissionsLoaded(
          permissions: permissions.items,
          totalCount: permissions.totalCount,
        ),
      );
    } on Object catch (e) {
      log.severe('Error loading permissions: $e');
      emit(
        StateProfilePermissionsError(
          message: t.profile.permissions.errorLoad(error: e.toString()),
        ),
      );
    }
  }
}

sealed class StateProfilePermissions {
  const StateProfilePermissions();
}

final class StateProfilePermissionsInitial extends StateProfilePermissions {
  const StateProfilePermissionsInitial();
}

final class StateProfilePermissionsLoading extends StateProfilePermissions {
  const StateProfilePermissionsLoading();
}

final class StateProfilePermissionsLoaded extends StateProfilePermissions {
  const StateProfilePermissionsLoaded({
    required this.permissions,
    required this.totalCount,
  });

  final List<PermissionResponse> permissions;
  final int totalCount;
}

final class StateProfilePermissionsError extends StateProfilePermissions {
  const StateProfilePermissionsError({required this.message});

  final String message;
}
