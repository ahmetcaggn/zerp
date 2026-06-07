import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/permission/cubit_permission.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';

// ─── InheritedWidget ─────────────────────────────────────────────────────────

/// Provides the current [StatePermission] to the subtree.
///
/// Use [PermissionScope.hasAction] anywhere in the tree for O(1) permission
/// checks. Use [PermissionScope.of] to access the full state.
class PermissionScope extends InheritedWidget {
  const PermissionScope({
    required this.state,
    required super.child,
    super.key,
  });

  final StatePermission state;

  /// Returns the nearest [StatePermission] from the widget tree.
  ///
  /// Throws if no [PermissionScope] ancestor is found.
  static StatePermission of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<PermissionScope>();
    assert(
      scope != null,
      'No PermissionScope found in context. '
      'Make sure PermissionScopeProvider is an ancestor of this widget.',
    );
    return scope!.state;
  }

  /// Returns `true` only when the current state is [StatePermissionLoaded] and
  /// [action] is present in the flattened permission set.
  ///
  /// Returns `false` when the state is not [StatePermissionLoaded] (fail-safe).
  static bool hasAction(
    BuildContext context,
    PermittableAction action,
  ) {
    final state = of(context);
    return state is StatePermissionLoaded && state.hasAction(action);
  }

  @override
  bool updateShouldNotify(PermissionScope oldWidget) =>
      state != oldWidget.state;
}

// ─── Provider ────────────────────────────────────────────────────────────────

/// Bridges [CubitPermission] to [PermissionScope] and handles loading / error
/// UX before the child tree is rendered.
///
/// Place this widget inside your root widget after all [BlocProvider]s are set
/// up.
///
/// **When not authenticated** (any non-[StateAuthAuthenticated] auth state):
/// the child is passed through immediately — no permission gate is applied.
///
/// **When authenticated**:
/// - **Loading**: shows a full-screen circular loading indicator.
/// - **Error**: shows a full-screen error message with a retry button.
/// - **Loaded**: wraps `child` in [PermissionScope] and renders it normally.
class PermissionScopeProvider extends StatelessWidget {
  const PermissionScopeProvider({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitAuth, StateAuth>(
      builder: (context, authState) {
        // When not authenticated, bypass permission gating entirely.
        // The login screen (and any pre-auth UI) must always be reachable.
        if (authState is! StateAuthAuthenticated) {
          return child;
        }

        // Authenticated — gate on permission state.
        return BlocBuilder<CubitPermission, StatePermission>(
          builder: (context, permState) {
            return switch (permState) {
              StatePermissionInitial() ||
              StatePermissionLoading() => const _PermissionLoadingScreen(),
              StatePermissionError(:final message) => _PermissionErrorScreen(
                message: message,
              ),
              StatePermissionLoaded() => PermissionScope(
                state: permState,
                child: child,
              ),
            };
          },
        );
      },
    );
  }
}

// ─── Loading screen ──────────────────────────────────────────────────────────

class _PermissionLoadingScreen extends StatelessWidget {
  const _PermissionLoadingScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}

// ─── Error screen ────────────────────────────────────────────────────────────

class _PermissionErrorScreen extends StatelessWidget {
  const _PermissionErrorScreen({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.lock_outline,
                size: 64,
                color: Theme.of(context).colorScheme.error,
              ),
              const SizedBox(height: 16),
              Text(
                'Failed to load permissions',
                style: Theme.of(context).textTheme.titleLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                message,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: () =>
                    context.read<CubitPermission>().loadPermissionsForced(),
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
