import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_resource/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/stock/stock_service.dart';

@injectable
class CubitStockMovements extends Cubit<StateStockMovements>
    with LoggerMixin<CubitStockMovements> {
  CubitStockMovements(this._stockService)
    : super(const StateStockMovementsInitial());

  final StockService _stockService;

  StockMovementPeriod _period = StockMovementPeriod.week;
  DateTime _cursor = DateTime.now();
  String? _selectedResourceId;
  String? _shopId;

  Future<void> load({
    required String shopId,
    StockMovementPeriod? period,
    DateTime? cursor,
    String? selectedResourceId,
  }) async {
    _shopId = shopId;
    if (period != null) _period = period;
    if (cursor != null) _cursor = cursor;
    _selectedResourceId = selectedResourceId;

    emit(
      StateStockMovementsLoading(
        period: _period,
        cursor: _cursor,
        selectedResourceId: _selectedResourceId,
      ),
    );

    try {
      final range = _periodRange(_period, _cursor);

      final results = await Future.wait([
        _stockService.getStockMovementTimeline(
          shopId: shopId,
          from: range.from,
          to: range.to,
          stockResourceId: _selectedResourceId,
          bucket: _period.timelineBucket,
        ),
        _stockService.getStockMovementDrillDown(
          shopId: shopId,
          from: range.from,
          to: range.to,
          stockResourceId: _selectedResourceId,
        ),
      ]);

      final timeline = results[0] as StockMovementTimelineDTO;
      final movements = results[1] as List<StockMovementDTO>;

      emit(
        StateStockMovementsLoaded(
          timeline: timeline,
          movements: movements,
          period: _period,
          cursor: _cursor,
          selectedResourceId: _selectedResourceId,
        ),
      );
    } on Object catch (e) {
      log.severe('Failed to load stock movements: $e');
      emit(StateStockMovementsError(message: e.toString()));
    }
  }

  Future<void> changePeriod(StockMovementPeriod period) async {
    if (_shopId == null) return;
    await load(shopId: _shopId!, period: period, cursor: _cursor);
  }

  Future<void> shiftCursor(int direction) async {
    if (_shopId == null) return;
    final shifted = _shiftCursor(_period, _cursor, direction);
    await load(shopId: _shopId!, cursor: shifted);
  }

  void selectBucket(String? bucketStart) {
    final current = state;
    if (current is StateStockMovementsLoaded) {
      emit(current.copyWith(selectedBucketStart: bucketStart));
    }
  }

  Future<void> changeResource(String? resourceId) async {
    if (_shopId == null) return;
    await load(shopId: _shopId!, selectedResourceId: resourceId);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  static ({DateTime from, DateTime to}) _periodRange(
    StockMovementPeriod period,
    DateTime cursor,
  ) {
    switch (period) {
      case StockMovementPeriod.day:
        final from = DateTime(cursor.year, cursor.month, cursor.day);
        return (from: from, to: from.add(const Duration(days: 1)));
      case StockMovementPeriod.week:
        final diff = cursor.weekday - 1; // Mon=0
        final from = DateTime(cursor.year, cursor.month, cursor.day - diff);
        return (from: from, to: from.add(const Duration(days: 7)));
      case StockMovementPeriod.month:
        final from = DateTime(cursor.year, cursor.month);
        return (from: from, to: from.add(const Duration(days: 28)));
    }
  }

  static DateTime _shiftCursor(
    StockMovementPeriod period,
    DateTime cursor,
    int direction,
  ) {
    switch (period) {
      case StockMovementPeriod.day:
        return cursor.add(Duration(days: direction));
      case StockMovementPeriod.week:
        return cursor.add(Duration(days: 7 * direction));
      case StockMovementPeriod.month:
        return DateTime(cursor.year, cursor.month + direction, cursor.day);
    }
  }
}

enum StockMovementPeriod { day, week, month }

extension StockMovementPeriodExtension on StockMovementPeriod {
  String get bucket {
    return switch (this) {
      StockMovementPeriod.day => 'DAY',
      StockMovementPeriod.week => 'WEEK',
      StockMovementPeriod.month => 'MONTH',
    };
  }

  /// The timeline bucket used internally (MONTH → WEEK, WEEK/DAY → DAY).
  String get timelineBucket {
    return switch (this) {
      StockMovementPeriod.month => 'WEEK',
      _ => 'DAY',
    };
  }
}

sealed class StateStockMovements {
  const StateStockMovements();
}

final class StateStockMovementsInitial extends StateStockMovements {
  const StateStockMovementsInitial();
}

final class StateStockMovementsLoading extends StateStockMovements {
  const StateStockMovementsLoading({
    this.period = StockMovementPeriod.week,
    this.cursor,
    this.selectedResourceId,
  });

  final StockMovementPeriod period;
  final DateTime? cursor;
  final String? selectedResourceId;
}

final class StateStockMovementsLoaded extends StateStockMovements {
  const StateStockMovementsLoaded({
    required this.timeline,
    required this.movements,
    required this.period,
    required this.cursor,
    this.selectedResourceId,
    this.selectedBucketStart,
  });

  final StockMovementTimelineDTO timeline;
  final List<StockMovementDTO> movements;
  final StockMovementPeriod period;
  final DateTime cursor;
  final String? selectedResourceId;
  final String? selectedBucketStart;

  StateStockMovementsLoaded copyWith({
    StockMovementTimelineDTO? timeline,
    List<StockMovementDTO>? movements,
    StockMovementPeriod? period,
    DateTime? cursor,
    String? selectedResourceId,
    Object? selectedBucketStart = _sentinel,
  }) {
    return StateStockMovementsLoaded(
      timeline: timeline ?? this.timeline,
      movements: movements ?? this.movements,
      period: period ?? this.period,
      cursor: cursor ?? this.cursor,
      selectedResourceId: selectedResourceId ?? this.selectedResourceId,
      selectedBucketStart: selectedBucketStart == _sentinel
          ? this.selectedBucketStart
          : selectedBucketStart as String?,
    );
  }
}

final class StateStockMovementsError extends StateStockMovements {
  const StateStockMovementsError({required this.message});

  final String message;
}

const _sentinel = Object();
