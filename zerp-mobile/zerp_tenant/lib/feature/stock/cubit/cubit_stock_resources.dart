import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_resource/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/stock/stock_service.dart';

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

sealed class StateStockResources {
  const StateStockResources();
}

final class StateStockResourcesInitial extends StateStockResources {
  const StateStockResourcesInitial();
}

final class StateStockResourcesLoading extends StateStockResources {
  const StateStockResourcesLoading();
}

final class StateStockResourcesLoaded extends StateStockResources {
  const StateStockResourcesLoaded({
    required this.resources,
    required this.overview,
    required this.page,
    required this.totalCount,
  });

  final List<StockResourceDTO> resources;
  final List<StockOverviewDTO> overview;
  final int page;
  final int totalCount;
}

final class StateStockResourcesError extends StateStockResources {
  const StateStockResourcesError({required this.message});

  final String message;
}

// ---------------------------------------------------------------------------
// Cubit
// ---------------------------------------------------------------------------

@injectable
class CubitStockResources extends Cubit<StateStockResources>
    with LoggerMixin<CubitStockResources> {
  CubitStockResources(this._stockService)
    : super(const StateStockResourcesInitial());

  final StockService _stockService;
  static const int _perPage = 20;

  Future<void> load({required String shopId, int page = 1}) async {
    emit(const StateStockResourcesLoading());
    try {
      final results = await Future.wait([
        _stockService.getStockResources(
          shopId: shopId,
          pageRequest: PageRequest.fromPageAndSize(page: page, size: _perPage),
        ),
        _stockService.getStockOverview(shopId: shopId),
      ]);
      final resourcePage = results[0] as PageResponse<StockResourceDTO>;
      final overview = results[1] as List<StockOverviewDTO>;
      emit(
        StateStockResourcesLoaded(
          resources: resourcePage.items,
          overview: overview,
          page: page,
          totalCount: resourcePage.totalCount,
        ),
      );
    } on Object catch (e) {
      log.severe('Failed to load stock resources: $e');
      emit(StateStockResourcesError(message: e.toString()));
    }
  }

  Future<void> createResource({
    required String shopId,
    required StockResourceCreateDTO dto,
  }) async {
    try {
      await _stockService.createStockResource(dto: dto);
      await load(shopId: shopId);
    } on Object catch (e) {
      log.severe('Failed to create stock resource: $e');
      rethrow;
    }
  }

  Future<void> updateResource({
    required String id,
    required String shopId,
    required StockResourceUpdateDTO dto,
  }) async {
    try {
      await _stockService.updateStockResource(id: id, dto: dto);
      await load(shopId: shopId);
    } on Object catch (e) {
      log.severe('Failed to update stock resource: $e');
      rethrow;
    }
  }
}
