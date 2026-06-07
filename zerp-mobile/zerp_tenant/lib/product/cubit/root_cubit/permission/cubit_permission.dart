import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@lazySingleton
final class CubitPermission extends BaseCubit<StatePermission>
    with LoggerMixin<CubitPermission> {
  CubitPermission(this._permissionService)
    : super(const StatePermissionInitial());

  final PermissionService _permissionService;

  Future<void>? _loadFuture;

  /// Forces a fresh load, discarding any in-progress load.
  Future<void> loadPermissionsForced() async {
    log.fine('Forcing permission tree to be loaded');

    try {
      if (_loadFuture != null) {
        log.fine(
          'Permission tree is currently being loaded, '
          'discarding existing load before forcing',
        );
        _loadFuture = null;
      }
    } on Object catch (e, s) {
      log.severe(
        'Error while discarding existing permission load before forcing',
        e,
        s,
      );
    } finally {
      await loadPermissions();
    }

    log.fine('Current state after loadPermissionsForced: $state');
  }

  /// Loads permissions only if not already loaded; deduplicates concurrent
  /// calls.
  Future<void> loadPermissionsIfNeeded() async {
    if (state is! StatePermissionLoaded) {
      if (_loadFuture != null) {
        log.fine(
          'Permission tree is currently being loaded, awaiting existing load',
        );
        try {
          await _loadFuture;
        } on Object catch (_) {}
      }

      if (state is! StatePermissionLoaded) {
        await loadPermissions();
      } else {
        log.fine('Permissions already loaded, skipping');
      }
    }

    log.fine('Current state after loadPermissionsIfNeeded: $state');
  }

  /// Starts a load; deduplicates concurrent calls by reusing the same future.
  Future<void> loadPermissions() async {
    if (_loadFuture != null) {
      log.fine(
        'Permission load already in progress, awaiting existing load',
      );
      return _loadFuture!;
    }
    log.fine('Starting permission tree load');
    _loadFuture = _loadPermissions();
    final result = await _loadFuture;
    _loadFuture = null;
    return result;
  }

  Future<void> _loadPermissions() async {
    emit(const StatePermissionLoading());

    try {
      final tree = await _permissionService.getPermittableTree();
      final flatActions = StatePermissionLoaded._flatten(tree);
      log.info(
        'Permission tree loaded. Flat action count: ${flatActions.length}',
      );
      emit(StatePermissionLoaded(tree: tree, flatActions: flatActions));
    } on Object catch (e, s) {
      log.severe('Failed to fetch permission tree', e, s);
      emit(
        StatePermissionError(
          previousState: state,
          message: t.permission.errorLoad(error: e.toString()),
        ),
      );
    } finally {
      _loadFuture = null;
      if (state is StatePermissionLoading) {
        log.shout(
          'Permission loading completed but state is still loading — '
          'this should not happen, resetting to initial state',
        );
        emit(const StatePermissionInitial());
      }
    }
  }

  /// Retries loading after an error.
  Future<void> retry() async {
    log.fine('Retrying permission tree load');
    final currentState = state;
    if (currentState is StatePermissionError) {
      await loadPermissions();
    } else {
      log.shout(
        'Cannot retry: current state is not StatePermissionError '
        '(currentState: $currentState)',
      );
    }
    log.fine('Current state after retry: $state');
  }

  /// Resets to initial — call on logout.
  void reset() {
    log.fine('Resetting permission state to initial');
    emit(const StatePermissionInitial());
  }
}

// ─── State classes ──────────────────────────────────────────────────────────

sealed class StatePermission {
  const StatePermission();
}

final class StatePermissionInitial extends StatePermission {
  const StatePermissionInitial();

  @override
  String toString() => 'StatePermissionInitial()';
}

final class StatePermissionLoading extends StatePermission {
  const StatePermissionLoading();

  @override
  String toString() => 'StatePermissionLoading()';
}

final class StatePermissionLoaded extends StatePermission {
  const StatePermissionLoaded({
    required this.tree,
    required this.flatActions,
  });

  /// The raw tree returned by the server.
  final PermittableTreeNodeDTO tree;

  /// Flattened set of all actions present anywhere in the tree — O(1) lookup.
  final Set<PermittableAction> flatActions;

  /// Convenience: returns true when [action] is present in the flat set.
  bool hasAction(PermittableAction action) {
    if (flatActions.contains(PermittableAction.ADMIN)) {
      return true;
    }
    return flatActions.contains(action);
  }

  /// Returns true when [action] is present in the scope of [targetId].
  /// This checks if the action is in the path to the target node or in the
  /// target node's subtree.
  bool hasActionInScope(PermittableAction action, String? targetId) {
    if (targetId == null) {
      return hasAction(action);
    }

    // If the user has ADMIN permission over the tenant globally,
    // they are allowed to perform any action on any target.
    final globalActions = _getGlobalAncestorActions(tree);
    if (globalActions.contains(PermittableAction.ADMIN)) {
      return true;
    }

    final actionsInScope = _getActionsInScope(tree, targetId);
    if (actionsInScope != null) {
      if (actionsInScope.contains(PermittableAction.ADMIN)) {
        return true;
      }
      return actionsInScope.contains(action);
    }

    // If targetId is not found in the tree, it means there are no specific
    // permissions for it. However, global/tenant-wide permissions still apply.
    return globalActions.contains(action);
  }

  Set<PermittableAction> _getGlobalAncestorActions(
    PermittableTreeNodeDTO node,
  ) {
    final actions = <PermittableAction>{};

    if (node.targetType == null ||
        node.targetType == PermittableTreeNodeDTOTargetTypeEnum.TENANT_ROOT ||
        node.targetType == PermittableTreeNodeDTOTargetTypeEnum.TENANT) {
      actions.addAll(node.actions);
      for (final child in node.children) {
        actions.addAll(_getGlobalAncestorActions(child));
      }
    }

    return actions;
  }

  Set<PermittableAction>? _getActionsInScope(
    PermittableTreeNodeDTO node,
    String targetId,
  ) {
    if (node.id == targetId) {
      return _flatten(node);
    }

    for (final child in node.children) {
      final childResult = _getActionsInScope(child, targetId);
      if (childResult != null) {
        return {
          ...node.actions,
          ...childResult,
        };
      }
    }

    return null;
  }

  static Set<PermittableAction> _flatten(PermittableTreeNodeDTO node) {
    return {
      ...node.actions,
      for (final child in node.children) ..._flatten(child),
    };
  }

  @override
  String toString() => 'StatePermissionLoaded(actions: ${flatActions.length})';
}

final class StatePermissionError extends StatePermission {
  const StatePermissionError({
    required this.previousState,
    required this.message,
  });

  final StatePermission previousState;
  final String message;

  @override
  String toString() =>
      'StatePermissionError(previousState: $previousState, message: $message)';
}
