import 'dart:async';

import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:uuid/uuid.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/app_messenger/state_app_messenger.dart';

/// Cubit that manages the queue of messages shown inside the app scaffold.
///
/// Messages are added via [showMessage], [showInfo], [showSuccess],
/// [showWarning], or [showError], and are automatically removed after their
/// [AppMessage.duration] elapses.
///
/// A message can also be dismissed early by calling [dismiss] with its id.
@lazySingleton
final class CubitAppMessenger
    extends BaseCubit<StateAppMessenger>
    with LoggerMixin<CubitAppMessenger> {
  CubitAppMessenger() : super(const StateAppMessenger([]));

  static const _uuid = Uuid();

  /// Internal mutable queue. A copy is emitted as an immutable list in state.
  final List<AppMessage> _queue = [];

  /// Active auto-dismiss timers keyed by message id.
  final Map<String, Timer> _timers = {};

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /// Shows a message of the specified [type].
  ///
  /// Returns the generated message id so callers can dismiss it early.
  String showMessage({
    required String message,
    AppMessageType type = AppMessageType.info,
    Duration duration = const Duration(seconds: 4),
  }) {
    final id = _uuid.v4();
    final entry = AppMessage(
      id: id,
      message: message,
      type: type,
      duration: duration,
    );
    _enqueue(entry);
    return id;
  }

  /// Convenience helper for info messages with the default 4-second duration.
  String showInfo(String message) =>
      showMessage(message: message);

  /// Convenience helper for success messages (4-second duration).
  String showSuccess(String message) =>
      showMessage(
        message: message,
        type: AppMessageType.success,
      );

  /// Convenience helper for [AppMessageType.warning].
  String showWarning(
    String message, {
    Duration duration = const Duration(seconds: 5),
  }) =>
      showMessage(
        message: message,
        type: AppMessageType.warning,
        duration: duration,
      );

  /// Convenience helper for [AppMessageType.error].
  String showError(
    String message, {
    Duration duration = const Duration(seconds: 6),
  }) =>
      showMessage(
        message: message,
        type: AppMessageType.error,
        duration: duration,
      );

  /// Removes the message with [id] immediately.
  void dismiss(String id) {
    log.fine('Dismissing message: $id');
    _cancelTimer(id);
    _queue.removeWhere((m) => m.id == id);
    _emitCurrent();
  }

  /// Removes all messages immediately.
  void dismissAll() {
    log.fine('Dismissing all messages');
    List.of(_timers.keys).forEach(_cancelTimer);
    _queue.clear();
    _emitCurrent();
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  void _enqueue(AppMessage entry) {
    log.fine('Enqueueing message: $entry');
    _queue.add(entry);
    _emitCurrent();

    // Schedule auto-dismiss.
    _timers[entry.id] = Timer(entry.duration, () => dismiss(entry.id));
  }

  void _cancelTimer(String id) {
    _timers.remove(id)?.cancel();
  }

  void _emitCurrent() {
    emit(StateAppMessenger(List.unmodifiable(_queue)));
  }

  @override
  Future<void> close() async {
    for (final timer in _timers.values) {
      timer.cancel();
    }
    _timers.clear();
    return super.close();
  }
}
