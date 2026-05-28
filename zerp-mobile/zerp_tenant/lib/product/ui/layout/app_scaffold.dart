import 'package:flutter/material.dart' hide RouteSettings;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';

/// AppScaffold is the main scaffold component used across the application.
///
/// This widget provides a consistent layout structure for all screens except
/// authentication and settings screens.
///
/// Features:
/// - Fixed AppBar with dynamic title
/// - Standardized Material Design Scaffold implementation
/// - Built-in support for FAB (Floating Action Button)
/// - Flexible body content
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    required this.body,
    required this.title,
    this.titleWidget,
    this.actions = const [],
    this.drawer,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.endDrawer,
    this.bottomNavigationBar,
    this.bottomSheet,
    this.backgroundColor,
    this.resizeToAvoidBottomInset,
    this.primary = true,
    super.key,
  });

  /// The main content widget of the scaffold
  final Widget body;

  /// The title displayed in the AppBar (dynamic)
  final String title;

  /// The title widget displayed in the AppBar (dynamic)
  final Widget? titleWidget;

  /// Optional list of action widgets for the AppBar, which defaults to empty.
  final List<Widget> actions;

  /// Optional drawer widget
  final Widget? drawer;

  /// Optional floating action button
  final Widget? floatingActionButton;

  /// Location of the floating action button
  final FloatingActionButtonLocation? floatingActionButtonLocation;

  /// Optional end drawer widget
  final Widget? endDrawer;

  /// Optional bottom navigation bar
  final Widget? bottomNavigationBar;

  /// Optional bottom sheet
  final Widget? bottomSheet;

  /// Background color of the scaffold
  final Color? backgroundColor;

  /// Whether to resize to avoid bottom inset (keyboard)
  final bool? resizeToAvoidBottomInset;

  /// Whether this scaffold is the primary focus
  final bool primary;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          AppBar(
            title: titleWidget ?? Text(title),
            actions: actions,
            elevation: 2,
          ),
          const _OrganizationScopeError(),
          Expanded(child: body),
        ],
      ),
      drawer: drawer,
      endDrawer: endDrawer,
      floatingActionButton: floatingActionButton,
      floatingActionButtonLocation: floatingActionButtonLocation,
      bottomNavigationBar: bottomNavigationBar,
      bottomSheet: bottomSheet,
      backgroundColor: backgroundColor,
      resizeToAvoidBottomInset: resizeToAvoidBottomInset,
      primary: primary,
    );
  }
}

final class _OrganizationScopeError extends StatelessWidget {
  const _OrganizationScopeError();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitOrganizationScope, StateOrganizationScope>(
      builder: (context, state) {
        if (state is StateOrganizationScopeLoading ||
            state is StateOrganizationScopeInitial) {
          return Container(
            color: Colors.blueAccent,
            padding: const EdgeInsets.all(8),
            child: const Row(
              children: [
                SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                ),
                SizedBox(width: 8),
                Text(
                  'Loading organization scope...',
                  style: TextStyle(color: Colors.white),
                ),
              ],
            ),
          );
        } else if (state is StateOrganizationScopeError) {
          return Container(
            color: Colors.redAccent,
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    state.message,
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
                if (state.previousState is StateOrganizationScopeTenant)
                  IconButton(
                    onPressed: () {
                      context.read<CubitOrganizationScope>().dismissError();
                    },
                    icon: const Icon(Icons.close, color: Colors.white),
                  ),
                IconButton(
                  onPressed: () async {
                    await context.read<CubitOrganizationScope>().retry();
                  },
                  icon: const Icon(Icons.refresh, color: Colors.white),
                ),
              ],
            ),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}
