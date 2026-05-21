import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@injectable
class CubitViewProfilePermissions extends BaseCubit<StateViewProfilePermissions>
    with LoggerMixin<CubitViewProfilePermissions> {
  CubitViewProfilePermissions(this._permissionService)
    : super(const StateViewProfilePermissionsInitial());

  final PermissionService _permissionService;

  static const int _previewCount = 3;

  Future<void> loadPermissions() async {
    emit(const StateViewProfilePermissionsLoading());
    try {
      final permissions = await _permissionService.getAllOwnedPermissions(
        const PageRequest(start: 0, end: _previewCount),
      );
      emit(
        StateViewProfilePermissionsLoaded(
          permissions: permissions.items,
          totalCount: permissions.totalCount,
        ),
      );
    } on Object catch (e) {
      log.severe('Error loading permissions: $e');
      emit(
        StateViewProfilePermissionsError(
          message: t.profile.permissions.errorLoad(error: e.toString()),
        ),
      );
    }
  }
}

sealed class StateViewProfilePermissions {
  const StateViewProfilePermissions();
}

final class StateViewProfilePermissionsInitial
    extends StateViewProfilePermissions {
  const StateViewProfilePermissionsInitial();
}

final class StateViewProfilePermissionsLoading
    extends StateViewProfilePermissions {
  const StateViewProfilePermissionsLoading();
}

final class StateViewProfilePermissionsLoaded
    extends StateViewProfilePermissions {
  const StateViewProfilePermissionsLoaded({
    required this.permissions,
    required this.totalCount,
  });

  final List<PermissionResponse> permissions;
  final int totalCount;
}

final class StateViewProfilePermissionsError
    extends StateViewProfilePermissions {
  const StateViewProfilePermissionsError({required this.message});

  final String message;
}
