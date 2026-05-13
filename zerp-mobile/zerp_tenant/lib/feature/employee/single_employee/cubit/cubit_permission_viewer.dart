import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';

@injectable
class CubitPermissionViewer extends BaseCubit<StatePermissionViewer>
    with LoggerMixin<CubitPermissionViewer> {
  CubitPermissionViewer(this._permissionService)
    : super(const StatePermissionViewerInitial());

  final PermissionService _permissionService;

  static const int _previewCount = 3;

  Future<void> loadPermissions({required String userId}) async {
    emit(const StatePermissionViewerLoading());
    try {
      final permissions = await _permissionService.getPermissionsOfUser(
        pageRequest: const PageRequest(start: 0, end: _previewCount),
        userId: userId,
      );
      emit(
        StatePermissionViewerLoaded(
          permissions: permissions.items,
          totalCount: permissions.totalCount,
        ),
      );
    } on Object catch (e) {
      log.severe('Error loading permissions: $e');
      emit(
        StatePermissionViewerError('Failed to load permissions: $e'),
      );
    }
  }
}

sealed class StatePermissionViewer {
  const StatePermissionViewer();
}

final class StatePermissionViewerInitial extends StatePermissionViewer {
  const StatePermissionViewerInitial();
}

final class StatePermissionViewerLoading extends StatePermissionViewer {
  const StatePermissionViewerLoading();
}

final class StatePermissionViewerLoaded extends StatePermissionViewer {
  const StatePermissionViewerLoaded({
    required this.permissions,
    required this.totalCount,
  });

  final List<PermissionResponse> permissions;
  final int totalCount;
}

final class StatePermissionViewerError extends StatePermissionViewer {
  const StatePermissionViewerError(this.message);

  final String message;
}
