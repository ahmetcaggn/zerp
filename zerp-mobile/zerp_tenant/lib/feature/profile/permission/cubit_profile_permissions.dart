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
          filteredPermissions: permissions.items,
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

  void filterPermissions(String query) {
    final currentState = state;
    if (currentState is StateProfilePermissionsLoaded) {
      final trimmedQuery = query.trim().toLowerCase();
      if (trimmedQuery.isEmpty) {
        _emitLoaded(
          filteredPermissions: currentState.permissions,
          filterQuery: '',
        );
        return;
      }

      final terms = trimmedQuery.split(RegExp(r'\s+'));

      final filtered = currentState.permissions.where((permission) {
        final action = permission.action?.value.toLowerCase() ?? '';
        final targetType = permission.targetType?.value.toLowerCase() ?? '';
        final targetId = permission.targetId?.toLowerCase() ?? '';

        return terms.every(
          (term) =>
              action.contains(term) ||
              targetType.contains(term) ||
              targetId.contains(term),
        );
      }).toList();

      _emitLoaded(
        filteredPermissions: filtered,
        filterQuery: query,
      );
    }
  }

  void _emitLoaded({
    List<PermissionResponse>? permissions,
    int? totalCount,
    List<PermissionResponse>? filteredPermissions,
    String? filterQuery,
  }) {
    final currentState = state;
    if (currentState is StateProfilePermissionsLoaded) {
      emit(
        StateProfilePermissionsLoaded(
          permissions: permissions ?? currentState.permissions,
          totalCount: totalCount ?? currentState.totalCount,
          filteredPermissions:
              filteredPermissions ?? currentState.filteredPermissions,
          filterQuery: filterQuery ?? currentState.filterQuery,
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
    required this.filteredPermissions,
    this.filterQuery = '',
  });

  final List<PermissionResponse> permissions;
  final int totalCount;

  final List<PermissionResponse> filteredPermissions;
  final String filterQuery;
}

final class StateProfilePermissionsError extends StateProfilePermissions {
  const StateProfilePermissionsError({required this.message});

  final String message;
}
