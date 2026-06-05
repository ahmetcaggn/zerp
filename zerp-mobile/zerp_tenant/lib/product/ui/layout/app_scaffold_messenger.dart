import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/app_messenger/cubit_app_messenger.dart';

export 'package:zerp_tenant/product/cubit/root_cubit/app_messenger/cubit_app_messenger.dart'
    show CubitAppMessenger;
export 'package:zerp_tenant/product/cubit/root_cubit/app_messenger/state_app_messenger.dart'
    show AppMessage, AppMessageType, StateAppMessenger;

/// A widget that makes [CubitAppMessenger] accessible to its subtree.
///
/// Analogous to Flutter's ScaffoldMessenger: any descendant can call
/// [AppScaffoldMessenger.of] to obtain the [CubitAppMessenger] and enqueue
/// messages that will be rendered inline by the app scaffold.
///
/// [AppScaffoldMessenger] itself is transparent — it wraps child without adding
/// any visible widgets. The actual rendering is done inside the app scaffold
/// via the `AppMessageBar` private widget.
///
/// Usage:
/// ```dart
/// AppScaffoldMessenger.of(context).showInfo('Hello!');
/// AppScaffoldMessenger.of(context).showError('Something went wrong');
/// ```
class AppScaffoldMessenger extends StatelessWidget {
  const AppScaffoldMessenger({required this.child, super.key});

  final Widget child;

  /// Returns the nearest [CubitAppMessenger] from the widget tree.
  ///
  /// Throws if no [BlocProvider] for [CubitAppMessenger] is found in the tree.
  /// Ensure [CubitAppMessenger] is provided at the app root.
  static CubitAppMessenger of(BuildContext context) {
    return context.read<CubitAppMessenger>();
  }

  @override
  Widget build(BuildContext context) => child;
}
