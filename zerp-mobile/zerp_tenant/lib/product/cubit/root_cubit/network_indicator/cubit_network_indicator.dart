import 'dart:collection';

import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/network/network_invoker/api_network_invoker.dart';

/// Cubit that tracks ongoing and completed HTTP requests made through
/// [ApiNetworkInvoker].
///
/// - Subscribes to `ApiNetworkInvoker.onUpdateRequestProgress` for live
///   in-progress updates.
/// - Subscribes to `ApiNetworkInvoker.onHistoryUpdate` for completed entries.
/// - Completed history is bounded by the invoker's `maxHistoryLength` (default
///   64) to prevent unbounded memory growth.
/// - Call [clearHistory] to wipe the completed list in the UI without affecting
///   in-flight requests.
@lazySingleton
final class CubitNetworkIndicator
    extends BaseCubit<StateNetworkIndicator>
    with LoggerMixin<CubitNetworkIndicator> {
  CubitNetworkIndicator(this._invoker)
      : super(
          const StateNetworkIndicatorData(
            inProgress: [],
            completed: [],
          ),
        ) {
    _invoker.onUpdateRequestProgress = _onProgressUpdate;
    _invoker.onHistoryUpdate = _onHistoryUpdate;
  }

  final ApiNetworkInvoker _invoker;

  void _onProgressUpdate(AggregatedRequestState aggregated) {
    final current = state as StateNetworkIndicatorData;
    emit(
      StateNetworkIndicatorData(
        inProgress: List.unmodifiable(aggregated.allProgresses),
        completed: current.completed,
      ),
    );
  }

  void _onHistoryUpdate(RequestHistoryEntry? entry) {
    if (entry == null) return;
    final current = state as StateNetworkIndicatorData;

    final maxLength = _invoker.maxHistoryLength;

    // The invoker removes the request from its progress map before calling this
    // callback, but it does NOT call onUpdateRequestProgress on completion.
    // We therefore evict the finished request from our inProgress list here.
    final updatedInProgress = List<RequestProgressState>.unmodifiable(
      current.inProgress.where((p) => p.request != entry.request),
    );

    // Prepend newest entry so the list is most-recent-first.
    var updated = [entry, ...current.completed];

    // Respect the invoker's maxHistoryLength cap.
    if (maxLength != null && updated.length > maxLength) {
      updated = updated.sublist(0, maxLength);
    }

    emit(
      StateNetworkIndicatorData(
        inProgress: updatedInProgress,
        completed: UnmodifiableListView(updated),
      ),
    );
  }

  /// Clears the completed request history shown in the UI.
  ///
  /// Does not affect in-flight requests or the invoker's internal history.
  void clearHistory() {
    final current = state as StateNetworkIndicatorData;
    emit(
      StateNetworkIndicatorData(
        inProgress: current.inProgress,
        completed: const [],
      ),
    );
    log.fine('Network indicator history cleared by user');
  }

  @override
  Future<void> close() async {
    _invoker.onUpdateRequestProgress = null;
    _invoker.onHistoryUpdate = null;
    return super.close();
  }
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

sealed class StateNetworkIndicator {
  const StateNetworkIndicator();
}

final class StateNetworkIndicatorData extends StateNetworkIndicator {
  const StateNetworkIndicatorData({
    required this.inProgress,
    required this.completed,
  });

  /// Currently active requests, ordered as reported by the invoker.
  final List<RequestProgressState> inProgress;

  /// Completed requests, most-recent-first, capped at the invoker's
  /// `maxHistoryLength`.
  final List<RequestHistoryEntry> completed;

  /// Convenience getter for the AppBar badge label.
  int get inProgressCount => inProgress.length;
}
