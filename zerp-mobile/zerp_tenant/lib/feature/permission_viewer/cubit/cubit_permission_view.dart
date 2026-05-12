import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/permission_viewer/cubit/state_permission_view.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';

@injectable
class CubitPermissionView extends BaseCubit<StatePermissionView>
    with LoggerMixin<CubitPermissionView> {
  CubitPermissionView(this._permissionService)
    : super(const StatePermissionViewInitial());

  final PermissionService _permissionService;

  Future<void> loadPermissions({
    PageRequest pageRequest = PageRequest.all,
  }) async {
    emit(const StatePermissionViewLoading());
    try {
      final permissions = await _permissionService.getAllOwnedPermissions(
        pageRequest,
      );
      emit(
        StatePermissionViewLoaded(
          permissions: permissions.items,
          totalCount: permissions.totalCount,
        ),
      );
    } on Object catch (e) {
      log.severe('Error loading permissions: $e');
      emit(
        StatePermissionViewError(message: 'Failed to load permissions: $e'),
      );
    }
  }
}
