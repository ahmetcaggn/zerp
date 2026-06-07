import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';

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
      final flatActions = _flatten(tree);
      log.info(
        'Permission tree loaded. Flat action count: ${flatActions.length}',
      );
      emit(StatePermissionLoaded(tree: tree, flatActions: flatActions));
    } on Object catch (e, s) {
      log.severe('Failed to fetch permission tree', e, s);
      emit(
        StatePermissionError(
          previousState: state,
          message: 'Failed to load permissions: $e',
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

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  Set<PermittableAction> _flatten(PermittableTreeNodeDTO node) {
    return {
      ...node.actions,
      for (final child in node.children) ..._flatten(child),
    };
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
  bool hasAction(PermittableAction action) => flatActions.contains(action);

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
