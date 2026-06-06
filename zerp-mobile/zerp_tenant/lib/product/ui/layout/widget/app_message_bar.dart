import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/app_messenger/cubit_app_messenger.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/app_messenger/state_app_messenger.dart';

/// Inline animated message bar rendered inside the app scaffold below the
/// AppBar.
///
/// Uses [AnimatedList] so each banner slides in and collapses out with a
/// combined [SizeTransition] + [FadeTransition] driven by the list's own
/// [Animation]. The overall container height therefore grows and shrinks
/// smoothly as messages are enqueued or dismissed.
///
/// This widget is package-private to the layout module; external code enqueues
/// messages through `AppScaffoldMessenger`.
final class AppMessageBar extends StatefulWidget {
  const AppMessageBar({super.key});

  @override
  State<AppMessageBar> createState() => _AppMessageBarState();
}

final class _AppMessageBarState extends State<AppMessageBar> {
  final _listKey = GlobalKey<AnimatedListState>();

  /// Shadow copy of the cubit's message list that drives [AnimatedList].
  ///
  /// We maintain this separately so we can diff successive states and know
  /// exactly which indices to insert / remove.
  final List<AppMessage> _messages = [];

  // ---------------------------------------------------------------------------
  // State diffing
  // ---------------------------------------------------------------------------

  void _onStateChanged(BuildContext context, StateAppMessenger state) {
    final incoming = state.messages;
    final incomingIds = incoming.map((m) => m.id).toSet();
    final currentIds = _messages.map((m) => m.id).toSet();

    // --- removals (iterate backwards to keep indices stable) ----------------
    for (var i = _messages.length - 1; i >= 0; i--) {
      if (!incomingIds.contains(_messages[i].id)) {
        final removed = _messages.removeAt(i);
        _listKey.currentState?.removeItem(
          i,
          (context, animation) => _MessageBanner(
            message: removed,
            animation: animation,
          ),
        );
      }
    }

    // --- additions ----------------------------------------------------------
    for (var i = 0; i < incoming.length; i++) {
      final msg = incoming[i];
      if (!currentIds.contains(msg.id)) {
        _messages.insert(i, msg);
        _listKey.currentState?.insertItem(i);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Build
  // ---------------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    return BlocListener<CubitAppMessenger, StateAppMessenger>(
      listener: _onStateChanged,
      child: ClipRect(
        child: AnimatedList(
          key: _listKey,
          shrinkWrap: true,
          padding: EdgeInsets.zero,
          physics: const NeverScrollableScrollPhysics(),
          initialItemCount: _messages.length,
          itemBuilder: (context, index, animation) => _MessageBanner(
            message: _messages[index],
            animation: animation,
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Individual animated message banner
// ---------------------------------------------------------------------------

final class _MessageBanner extends StatelessWidget {
  const _MessageBanner({required this.message, required this.animation});

  final AppMessage message;

  /// Driven by [AnimatedList]: goes 0 → 1 on insert, 1 → 0 on remove.
  final Animation<double> animation;

  @override
  Widget build(BuildContext context) {
    final curved = CurvedAnimation(
      parent: animation,
      curve: Curves.easeOut,
      reverseCurve: Curves.easeIn,
    );

    final style = _styleFor(message.type, context);

    return SizeTransition(
      sizeFactor: curved,
      alignment: Alignment.topCenter,
      child: FadeTransition(
        opacity: curved,
        child: Material(
          color: style.backgroundColor,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                Icon(style.icon, color: style.foregroundColor, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    message.message,
                    style: TextStyle(
                      color: style.foregroundColor,
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(width: 4),
                GestureDetector(
                  onTap: () =>
                      context.read<CubitAppMessenger>().dismiss(message.id),
                  child: Icon(
                    Icons.close,
                    color: style.foregroundColor.withValues(alpha: 0.7),
                    size: 18,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  _BannerStyle _styleFor(AppMessageType type, BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return switch (type) {
      AppMessageType.info => _BannerStyle(
        backgroundColor: cs.primaryContainer,
        foregroundColor: cs.onPrimaryContainer,
        icon: Icons.info_outline_rounded,
      ),
      AppMessageType.success => const _BannerStyle(
        backgroundColor: Color(0xFF1E4620),
        foregroundColor: Color(0xFFB9F6CA),
        icon: Icons.check_circle_outline_rounded,
      ),
      AppMessageType.warning => const _BannerStyle(
        backgroundColor: Color(0xFF4A3200),
        foregroundColor: Color(0xFFFFE082),
        icon: Icons.warning_amber_rounded,
      ),
      AppMessageType.error => _BannerStyle(
        backgroundColor: cs.errorContainer,
        foregroundColor: cs.onErrorContainer,
        icon: Icons.error_outline_rounded,
      ),
    };
  }
}

// ---------------------------------------------------------------------------
// Style record
// ---------------------------------------------------------------------------

final class _BannerStyle {
  const _BannerStyle({
    required this.backgroundColor,
    required this.foregroundColor,
    required this.icon,
  });

  final Color backgroundColor;
  final Color foregroundColor;
  final IconData icon;
}
