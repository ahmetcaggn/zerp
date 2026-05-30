import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_resource/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/stock/stock_service.dart';

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

sealed class StateStockOperations {
  const StateStockOperations();
}

final class StateStockOperationsIdle extends StateStockOperations {
  const StateStockOperationsIdle({this.history = const []});

  final List<StockOperationDTO> history;
}

final class StateStockOperationsLoading extends StateStockOperations {
  const StateStockOperationsLoading();
}

final class StateStockOperationsHistoryLoaded extends StateStockOperations {
  const StateStockOperationsHistoryLoaded({required this.history});

  final List<StockOperationDTO> history;
}

final class StateStockOperationsSubmitting extends StateStockOperations {
  const StateStockOperationsSubmitting();
}

final class StateStockOperationsSuccess extends StateStockOperations {
  const StateStockOperationsSuccess({required this.history});

  final List<StockOperationDTO> history;
}

final class StateStockOperationsError extends StateStockOperations {
  const StateStockOperationsError({
    required this.message,
    this.history = const [],
  });

  final String message;
  final List<StockOperationDTO> history;
}

// ---------------------------------------------------------------------------
// Cubit
// ---------------------------------------------------------------------------

@injectable
class CubitStockOperations extends Cubit<StateStockOperations>
    with LoggerMixin<CubitStockOperations> {
  CubitStockOperations(this._stockService)
    : super(const StateStockOperationsIdle());

  final StockService _stockService;

  List<StockOperationDTO> _history = [];

  Future<void> loadHistory({
    required String shopId,
    HistoryOperationTypeEnum? operationType,
    DateTime? from,
    DateTime? to,
    String? referenceNo,
  }) async {
    emit(const StateStockOperationsLoading());
    try {
      final history = await _stockService.getStockOperationHistory(
        shopId: shopId,
        operationType: operationType,
        from: from,
        to: to,
        referenceNo: referenceNo,
      );
      _history = history;
      emit(StateStockOperationsHistoryLoaded(history: history));
    } on Object catch (e) {
      log.severe('Failed to load operation history: $e');
      emit(StateStockOperationsError(message: e.toString(), history: _history));
    }
  }

  Future<void> createEntry({
    required String shopId,
    required StockEntryCreateDTO dto,
  }) async {
    emit(const StateStockOperationsSubmitting());
    try {
      await _stockService.createStockEntry(dto: dto);
      final history = await _stockService.getStockOperationHistory(
        shopId: shopId,
      );
      _history = history;
      emit(StateStockOperationsSuccess(history: history));
    } on Object catch (e) {
      log.severe('Failed to create stock entry: $e');
      emit(StateStockOperationsError(message: e.toString(), history: _history));
      rethrow;
    }
  }

  Future<void> createAdjustment({
    required String shopId,
    required StockAdjustmentCreateDTO dto,
  }) async {
    emit(const StateStockOperationsSubmitting());
    try {
      await _stockService.createStockAdjustment(dto: dto);
      final history = await _stockService.getStockOperationHistory(
        shopId: shopId,
      );
      _history = history;
      emit(StateStockOperationsSuccess(history: history));
    } on Object catch (e) {
      log.severe('Failed to create stock adjustment: $e');
      emit(StateStockOperationsError(message: e.toString(), history: _history));
      rethrow;
    }
  }

  void resetToIdle() {
    emit(StateStockOperationsIdle(history: _history));
  }
}
