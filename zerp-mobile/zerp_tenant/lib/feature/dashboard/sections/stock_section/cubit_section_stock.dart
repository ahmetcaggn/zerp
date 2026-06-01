import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_resource/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/stock/stock_service.dart';

@lazySingleton
class CubitSectionStock extends Cubit<StateSectionStock>
    with LoggerMixin<CubitSectionStock> {
  CubitSectionStock(this._stockService)
    : super(const StateSectionStockInitial());

  final StockService _stockService;

  Future<void> load(String shopId) async {
    try {
      emit(const StateSectionStockLoading());
      final startDate = DateTime.now().subtract(const Duration(days: 7));
      final endDate = DateTime.now();

      final resourcesFuture = _stockService.getStockResources(
        shopId: shopId,
        additionalParams: {
          'reorderThreshold.gte': '0',
        },
      );
      final operationsFuture = _stockService.getStockOperationHistory(
        shopId: shopId,
        limit: 3,
        from: startDate,
        to: endDate,
      );
      final countsFuture = _stockService.getStockCounts(
        shopId: shopId,
        pageRequest: const PageRequest(start: 0, end: 3),
        additionalParams: {
          'countDate.gte': startDate.toIso8601String(),
          'countDate.lte': endDate.toIso8601String(),
        },
      );

      final results = await Future.wait([
        resourcesFuture,
        operationsFuture,
        countsFuture,
      ]);

      final resourcesResponse = results[0] as PageResponse<StockResourceDTO>;
      final operations = results[1] as List<StockOperationDTO>;
      final countsResponse = results[2] as PageResponse<StockCountDTO>;

      emit(
        StateSectionStockLoaded(
          resources: resourcesResponse.items,
          recentOperations: operations,
          recentCounts: countsResponse.items,
        ),
      );
    } on Object catch (e, s) {
      log.severe('Error loading stock section', e, s);
      emit(StateSectionStockError(message: e.toString()));
    }
  }
}

sealed class StateSectionStock {
  const StateSectionStock();
}

final class StateSectionStockInitial extends StateSectionStock {
  const StateSectionStockInitial();
}

final class StateSectionStockLoading extends StateSectionStock {
  const StateSectionStockLoading();
}

final class StateSectionStockLoaded extends StateSectionStock {
  const StateSectionStockLoaded({
    required this.resources,
    this.recentOperations = const [],
    this.recentCounts = const [],
  });

  final List<StockResourceDTO> resources;
  final List<StockOperationDTO> recentOperations;
  final List<StockCountDTO> recentCounts;
}

final class StateSectionStockError extends StateSectionStock {
  const StateSectionStockError({required this.message});

  final String message;
}
