import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_resource/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/stock/stock_service.dart';

@injectable
class CubitStockCounts extends Cubit<StateStockCounts>
    with LoggerMixin<CubitStockCounts> {
  CubitStockCounts(this._stockService) : super(const StateStockCountsInitial());

  final StockService _stockService;
  static const int _perPage = 20;

  Future<void> load({required String shopId, int page = 1}) async {
    emit(const StateStockCountsLoading());
    try {
      final result = await _stockService.getStockCounts(
        shopId: shopId,
        pageRequest: PageRequest.fromPageAndSize(page: page, size: _perPage),
      );
      emit(
        StateStockCountsLoaded(
          counts: result.items,
          page: page,
          totalCount: result.totalCount,
        ),
      );
    } on Object catch (e) {
      log.severe('Failed to load stock counts: $e');
      emit(StateStockCountsError(message: e.toString()));
    }
  }

  Future<void> createCount({
    required String shopId,
    required StockCountCreateDTO dto,
  }) async {
    try {
      await _stockService.createStockCount(dto: dto);
      await load(shopId: shopId);
    } on Object catch (e) {
      log.severe('Failed to create stock count: $e');
      rethrow;
    }
  }

  Future<void> submitCountEntries({
    required String id,
    required String shopId,
    required List<Map<String, Object>> items,
  }) async {
    try {
      await _stockService.updateStockCount(
        id: id,
        patch: {
          'status': 'READY_FOR_APPROVAL',
          'items': items,
        },
      );
      await load(shopId: shopId);
    } on Object catch (e) {
      log.severe('Failed to submit count entries: $e');
      rethrow;
    }
  }

  Future<void> approveCount({
    required String id,
    required String shopId,
  }) async {
    try {
      await _stockService.approveStockCount(id: id);
      await load(shopId: shopId);
    } on Object catch (e) {
      log.severe('Failed to approve stock count: $e');
      rethrow;
    }
  }
}

sealed class StateStockCounts {
  const StateStockCounts();
}

final class StateStockCountsInitial extends StateStockCounts {
  const StateStockCountsInitial();
}

final class StateStockCountsLoading extends StateStockCounts {
  const StateStockCountsLoading();
}

final class StateStockCountsLoaded extends StateStockCounts {
  const StateStockCountsLoaded({
    required this.counts,
    required this.page,
    required this.totalCount,
  });

  final List<StockCountDTO> counts;
  final int page;
  final int totalCount;
}

final class StateStockCountsError extends StateStockCounts {
  const StateStockCountsError({required this.message});

  final String message;
}
