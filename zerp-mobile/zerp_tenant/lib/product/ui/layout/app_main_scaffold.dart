import 'package:flutter/material.dart' hide RouteSettings;

/// AppMainScaffold is the main scaffold component used across the application.
///
/// This widget provides a consistent layout structure for all screens except
/// authentication and settings screens.
///
/// Features:
/// - Fixed AppBar with dynamic title
/// - Standardized Material Design Scaffold implementation
/// - Built-in support for FAB (Floating Action Button)
/// - Flexible body content
class AppMainScaffold extends StatelessWidget {
  const AppMainScaffold({
    required this.body,
    required this.title,
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
      appBar: AppBar(
        title: Text(title),
        elevation: 2,
      ),
      body: body,
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
