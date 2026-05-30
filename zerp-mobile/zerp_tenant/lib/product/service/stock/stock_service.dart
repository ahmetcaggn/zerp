import 'package:injectable/injectable.dart';
import 'package:openapi_resource/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/service_base.dart';
import 'package:zerp_tenant/product/util/network_result_extension.dart';

@lazySingleton
class StockService extends ServiceBase with LoggerMixin<StockService> {
  StockService({
    required super.invoker,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  // ---------------------------------------------------------------------------
  // Stock Resources
  // ---------------------------------------------------------------------------

  Future<PageResponse<StockResourceDTO>> getStockResources({
    required String shopId,
    PageRequest pageRequest = PageRequest.all,
  }) async {
    final request = GetListStockResourceCommand(
      start: pageRequest.start,
      end: pageRequest.end,
      allParams: {'shop.id': shopId},
      sort: 'name',
      order: 'ASC',
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListStockResourceDTO>():
        final items = res.data.data;
        final totalCount = res.totalCountHeader ?? items.length;
        log.info('Fetched ${items.length} stock resources for shop $shopId.');
        return PageResponse(
          req: pageRequest,
          items: items,
          totalCount: totalCount,
        );
      case NetworkErrorResult<ApiResponseListStockResourceDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListStockResourceDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<List<StockOverviewDTO>> getStockOverview({
    required String shopId,
  }) async {
    final request = OverviewCommand(shopId: shopId);

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListStockOverviewDTO>():
        final items = res.data.data;
        log.info(
          'Fetched ${items.length} stock overview items for shop $shopId.',
        );
        return items;
      case NetworkErrorResult<ApiResponseListStockOverviewDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListStockOverviewDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<StockResourceDTO> createStockResource({
    required StockResourceCreateDTO dto,
  }) async {
    final request = CreateStockResourceCommand(stockResourceCreateDTO: dto);

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseStockResourceDTO>():
        final resource = res.data.data;
        if (resource == null) {
          throw Exception('Empty response creating stock resource');
        }
        log.info('Created stock resource: ${resource.id}');
        return resource;
      case NetworkErrorResult<ApiResponseStockResourceDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseStockResourceDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<StockResourceDTO> updateStockResource({
    required String id,
    required StockResourceUpdateDTO dto,
  }) async {
    final request = UpdateStockResourceCommand(
      id: id,
      stockResourceUpdateDTO: dto,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseStockResourceDTO>():
        final resource = res.data.data;
        if (resource == null) {
          throw Exception('Empty response updating stock resource');
        }
        log.info('Updated stock resource: $id');
        return resource;
      case NetworkErrorResult<ApiResponseStockResourceDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseStockResourceDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  // ---------------------------------------------------------------------------
  // Stock Movements
  // ---------------------------------------------------------------------------

  Future<StockMovementTimelineDTO> getStockMovementTimeline({
    required String shopId,
    required DateTime from,
    required DateTime to,
    String? stockResourceId,
    String? bucket,
  }) async {
    final request = TimelineCommand(
      shopId: shopId,
      from: from,
      to: to,
      stockResourceId: stockResourceId,
      bucket: bucket,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseStockMovementTimelineDTO>():
        final data = res.data.data;
        if (data == null) throw Exception('Empty timeline response');
        log.info('Fetched movement timeline for shop $shopId ($bucket).');
        return data;
      case NetworkErrorResult<ApiResponseStockMovementTimelineDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseStockMovementTimelineDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<List<StockMovementDTO>> getStockMovementDrillDown({
    required String shopId,
    required DateTime from,
    required DateTime to,
    String? stockResourceId,
    int limit = 500,
  }) async {
    final request = DrillDownCommand(
      shopId: shopId,
      from: from,
      to: to,
      stockResourceId: stockResourceId,
      limit: limit,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListStockMovementDTO>():
        final items = res.data.data;
        log.info(
          'Fetched ${items.length} drill-down movements for shop $shopId.',
        );
        return items;
      case NetworkErrorResult<ApiResponseListStockMovementDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListStockMovementDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  // ---------------------------------------------------------------------------
  // Stock Counts
  // ---------------------------------------------------------------------------

  Future<PageResponse<StockCountDTO>> getStockCounts({
    required String shopId,
    PageRequest pageRequest = PageRequest.all,
  }) async {
    final request = GetListStockCountCommand(
      start: pageRequest.start,
      end: pageRequest.end,
      allParams: {'shop.id': shopId},
      sort: 'countDate',
      order: 'DESC',
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListStockCountDTO>():
        final items = res.data.data;
        final totalCount = res.totalCountHeader ?? items.length;
        log.info('Fetched ${items.length} stock counts for shop $shopId.');
        return PageResponse(
          req: pageRequest,
          items: items,
          totalCount: totalCount,
        );
      case NetworkErrorResult<ApiResponseListStockCountDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListStockCountDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<StockCountDTO> createStockCount({
    required StockCountCreateDTO dto,
  }) async {
    final request = CreateStockCountCommand(stockCountCreateDTO: dto);

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseStockCountDTO>():
        final count = res.data.data;
        if (count == null) {
          throw Exception('Empty response creating stock count');
        }
        log.info('Created stock count: ${count.id}');
        return count;
      case NetworkErrorResult<ApiResponseStockCountDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseStockCountDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<StockCountDTO> updateStockCount({
    required String id,
    required Map<String, Object> patch,
  }) async {
    final request = PatchStockCountCommand(id: id, requestBody: patch);

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseStockCountDTO>():
        final count = res.data.data;
        if (count == null) {
          throw Exception('Empty response updating stock count');
        }
        log.info('Updated stock count: $id');
        return count;
      case NetworkErrorResult<ApiResponseStockCountDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseStockCountDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<void> approveStockCount({required String id}) async {
    final request = ApproveCommand(id: id);

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseStockCountDTO>():
        log.info('Approved stock count: $id');
        return;
      case NetworkErrorResult<ApiResponseStockCountDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseStockCountDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  // ---------------------------------------------------------------------------
  // Stock Operations (Entry / Adjustment)
  // ---------------------------------------------------------------------------

  Future<StockOperationDTO> createStockEntry({
    required StockEntryCreateDTO dto,
  }) async {
    final request = CreateEntryCommand(stockEntryCreateDTO: dto);

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseStockOperationDTO>():
        final operation = res.data.data;
        if (operation == null) {
          throw Exception('Empty response creating stock entry');
        }
        log.info('Created stock entry operation: ${operation.id}');
        return operation;
      case NetworkErrorResult<ApiResponseStockOperationDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseStockOperationDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<StockOperationDTO> createStockAdjustment({
    required StockAdjustmentCreateDTO dto,
  }) async {
    final request = CreateAdjustmentCommand(stockAdjustmentCreateDTO: dto);

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseStockOperationDTO>():
        final operation = res.data.data;
        if (operation == null) {
          throw Exception('Empty response creating stock adjustment');
        }
        log.info('Created stock adjustment operation: ${operation.id}');
        return operation;
      case NetworkErrorResult<ApiResponseStockOperationDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseStockOperationDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<List<StockOperationDTO>> getStockOperationHistory({
    required String shopId,
    HistoryOperationTypeEnum? operationType,
    DateTime? from,
    DateTime? to,
    String? referenceNo,
    int limit = 100,
  }) async {
    final request = HistoryCommand(
      shopId: shopId,
      operationType: operationType,
      from: from,
      to: to,
      referenceNo: referenceNo,
      limit: limit,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListStockOperationDTO>():
        final items = res.data.data;
        log.info('Fetched ${items.length} stock operations for shop $shopId.');
        return items;
      case NetworkErrorResult<ApiResponseListStockOperationDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListStockOperationDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }
}
