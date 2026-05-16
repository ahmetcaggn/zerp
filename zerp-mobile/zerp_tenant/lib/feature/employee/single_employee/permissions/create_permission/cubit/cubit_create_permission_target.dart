import 'dart:async';

import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/util/constants.dart';

typedef PermissionTargetType =
    ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum;

@injectable
class CubitCreatePermissionTarget extends BaseCubit<StateCreatePermissionTarget>
    with LoggerMixin<CubitCreatePermissionTarget> {
  CubitCreatePermissionTarget(this._permissionService)
    : super(const StateCreatePermissionTarget());

  final PermissionService _permissionService;

  void init({
    required PermissionTargetType selectedTargetType,
    required List<PermissionTargetType> allowedTargetTypes,
  }) {
    List<PermissionTargetType> hierarchy;
    final index = allowedTargetTypes.indexOf(selectedTargetType);
    if (index != -1) {
      final fullHierarchy = allowedTargetTypes.sublist(index).reversed.toList();
      hierarchy = fullHierarchy
          .where((type) => type != PermissionTargetType.TENANT_ROOT)
          .toList();
    } else {
      hierarchy = [selectedTargetType];
    }

    String? finalTargetId;
    if (selectedTargetType == PermissionTargetType.TENANT_ROOT) {
      finalTargetId = kTenantRootId;
    }

    emit(
      state.copyWith(
        selectedTargetType: selectedTargetType,
        hierarchy: hierarchy,
        selectedIds: {},
        selectedTitles: {},
        finalTargetId: finalTargetId,
        loadingLevels: {},
      ),
    );

    if (selectedTargetType != PermissionTargetType.TENANT_ROOT) {
      unawaited(_checkAutoSelect(0));
    }
  }

  Future<void> _checkAutoSelect(int index) async {
    final hierarchy = state.hierarchy;
    if (index >= hierarchy.length) return;

    final type = hierarchy[index];
    if (state.selectedIds.containsKey(type) ||
        state.loadingLevels.contains(type)) {
      return;
    }

    final parentId = index == 0
        ? null
        : state.selectedIds[hierarchy[index - 1]];
    if (index > 0 && parentId == null) return;

    emit(state.copyWith(loadingLevels: {...state.loadingLevels, type}));

    try {
      final items = await _permissionService.getPermittableList(
        targetType: type,
        parentId: parentId,
      );

      if (items.length == 1) {
        final item = items.first;
        _applySelection(index, type, item);
        // Check next level
        await _checkAutoSelect(index + 1);
      }
    } on Object catch (e) {
      log.severe('Failed to auto-select target for $type: $e', e);
    } finally {
      emit(
        state.copyWith(
          loadingLevels: state.loadingLevels.where((t) => t != type).toSet(),
        ),
      );
    }
  }

  void selectTarget(PermissionTargetType type, PermittableResponseDTO item) {
    final index = state.hierarchy.indexOf(type);
    if (index == -1) return;

    _applySelection(index, type, item);
    unawaited(_checkAutoSelect(index + 1));
  }

  void _applySelection(
    int index,
    PermissionTargetType type,
    PermittableResponseDTO item,
  ) {
    final selectedIds = Map<PermissionTargetType, String>.from(
      state.selectedIds,
    );
    final selectedTitles = Map<PermissionTargetType, String>.from(
      state.selectedTitles,
    );

    selectedIds[type] = item.id ?? '';
    selectedTitles[type] = item.title ?? '';

    // Clear child levels
    for (var i = index + 1; i < state.hierarchy.length; i++) {
      selectedIds.remove(state.hierarchy[i]);
      selectedTitles.remove(state.hierarchy[i]);
    }

    String? finalTargetId;
    if (type == state.selectedTargetType) {
      finalTargetId = item.id;
    }

    emit(
      state.copyWith(
        selectedIds: selectedIds,
        selectedTitles: selectedTitles,
        finalTargetId: finalTargetId,
      ),
    );
  }
}

class StateCreatePermissionTarget {
  const StateCreatePermissionTarget({
    this.selectedTargetType,
    this.hierarchy = const [],
    this.selectedIds = const {},
    this.selectedTitles = const {},
    this.loadingLevels = const {},
    this.finalTargetId,
  });

  final PermissionTargetType? selectedTargetType;
  final List<PermissionTargetType> hierarchy;
  final Map<PermissionTargetType, String> selectedIds;
  final Map<PermissionTargetType, String> selectedTitles;
  final Set<PermissionTargetType> loadingLevels;
  final String? finalTargetId;

  StateCreatePermissionTarget copyWith({
    PermissionTargetType? selectedTargetType,
    List<PermissionTargetType>? hierarchy,
    Map<PermissionTargetType, String>? selectedIds,
    Map<PermissionTargetType, String>? selectedTitles,
    Set<PermissionTargetType>? loadingLevels,
    String? finalTargetId,
  }) {
    return StateCreatePermissionTarget(
      selectedTargetType: selectedTargetType ?? this.selectedTargetType,
      hierarchy: hierarchy ?? this.hierarchy,
      selectedIds: selectedIds ?? this.selectedIds,
      selectedTitles: selectedTitles ?? this.selectedTitles,
      loadingLevels: loadingLevels ?? this.loadingLevels,
      finalTargetId: finalTargetId ?? this.finalTargetId,
    );
  }
}
