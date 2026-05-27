import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/service_base.dart';
import 'package:zerp_tenant/product/util/network_result_extension.dart';

@lazySingleton
class SaleService extends ServiceBase with LoggerMixin<SaleService> {
  SaleService({
    required super.invoker,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  Future<PageResponse<ShopDTO>> getShops({
    PageRequest pageRequest = PageRequest.all,
    Map<String, String> queryParams = const {},
  }) async {
    final request = GetListShopCommand(
      start: pageRequest.start,
      end: pageRequest.end,
      allParams: queryParams,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListShopDTO>():
        final shops = res.data.data;
        final totalCount = res.totalCountHeader ?? shops.length;
        log.info('Fetched ${shops.length} shops.');
        return PageResponse(
          req: pageRequest,
          items: shops,
          totalCount: totalCount,
        );
      case NetworkErrorResult<ApiResponseListShopDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListShopDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<PageResponse<ShopTableDTO>> getTables({
    required String shopId,
    required PageRequest pageRequest,
    String? searchName,
  }) async {
    final queryParams = <String, String>{
      'shop.id': shopId,
    };
    if (searchName != null && searchName.isNotEmpty) {
      queryParams['name.like'] = searchName;
    }

    final request = GetListShopTableCommand(
      start: pageRequest.start,
      end: pageRequest.end,
      allParams: queryParams,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListShopTableDTO>():
        final tables = res.data.data;
        final totalCount = res.totalCountHeader ?? tables.length;
        log.info(
          'Fetched ${tables.length} tables for shop $shopId '
          '(total: $totalCount).',
        );
        return PageResponse(
          req: pageRequest,
          items: tables,
          totalCount: totalCount,
        );
      case NetworkErrorResult<ApiResponseListShopTableDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListShopTableDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<ShopTableDTO> getTableById(String tableId) async {
    final request = GetOneShopTableCommand(id: tableId);

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseShopTableDTO>():
        final table = res.data.data;
        if (table == null) {
          throw Exception('Received empty table response from server');
        }
        log.info('Fetched table ${table.id} (${table.name}).');
        return table;
      case NetworkErrorResult<ApiResponseShopTableDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseShopTableDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<List<TableOrderDTO>> getActiveOrders({
    required String tableId,
  }) async {
    final request = GetListTableOrderCommand(
      start: 0,
      end: 20,
      allParams: {
        'shopTable.id': tableId,
        'status': 'OPEN',
      },
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListTableOrderDTO>():
        final orders = res.data.data;
        log.info('Fetched ${orders.length} active orders for table $tableId.');
        return orders;
      case NetworkErrorResult<ApiResponseListTableOrderDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListTableOrderDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<PublicCartOrderPreviewDTO> previewPublicCartOrder({
    required String code,
    required String tableId,
  }) async {
    final request = PreviewPublicCartOrderCommand(
      code: code,
      tableId: tableId,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<PublicCartOrderPreviewDTO>():
        log.info('Successfully previewed public cart order.');
        return res.data;
      case NetworkErrorResult<PublicCartOrderPreviewDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<PublicCartOrderPreviewDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<TableOrderDTO> createTableOrder({
    required TableOrderCreateDTO createDTO,
  }) async {
    final request = CreateTableOrderCommand(
      tableOrderCreateDTO: createDTO,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseTableOrderDTO>():
        final order = res.data.data;
        if (order == null) {
          throw Exception('Received empty order response from server');
        }
        log.info('Successfully created order: ${order.id}');
        return order;
      case NetworkErrorResult<ApiResponseTableOrderDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseTableOrderDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<TableOrderDTO> updateTableOrder({
    required String orderId,
    required TableOrderUpdateDTO updateDTO,
  }) async {
    final request = UpdateTableOrderCommand(
      id: orderId,
      tableOrderUpdateDTO: updateDTO,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseTableOrderDTO>():
        final order = res.data.data;
        if (order == null) {
          throw Exception('Received empty order response from server');
        }
        log.info('Successfully updated order: ${order.id}');
        return order;
      case NetworkErrorResult<ApiResponseTableOrderDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseTableOrderDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<void> cancelTableOrder({
    required String orderId,
  }) async {
    final request = PatchTableOrderCommand(
      id: orderId,
      requestBody: {
        'status': 'CANCELLED',
      },
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseTableOrderDTO>():
        log.info('Successfully cancelled order: $orderId');
        return;
      case NetworkErrorResult<ApiResponseTableOrderDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseTableOrderDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<PageResponse<MenuCategoryDTO>> getMenuCategories({
    required String shopId,
    PageRequest pageRequest = PageRequest.all,
  }) async {
    final request = GetListMenuCategoryCommand(
      start: pageRequest.start,
      end: pageRequest.end,
      allParams: {
        'menu.shop.id': shopId,
      },
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListMenuCategoryDTO>():
        final categories = res.data.data;
        final totalCount = res.totalCountHeader ?? categories.length;
        log.info('Fetched ${categories.length} categories for shop $shopId.');
        return PageResponse(
          req: pageRequest,
          items: categories,
          totalCount: totalCount,
        );
      case NetworkErrorResult<ApiResponseListMenuCategoryDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListMenuCategoryDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<PageResponse<MenuItemDTO>> getMenuItems({
    required String shopId,
    String? categoryId,
    PageRequest pageRequest = PageRequest.all,
  }) async {
    final params = <String, String>{
      'category.menu.shop.id': shopId,
    };
    if (categoryId != null && categoryId.isNotEmpty) {
      params['category.id'] = categoryId;
    }

    final request = GetListMenuItemCommand(
      start: pageRequest.start,
      end: pageRequest.end,
      allParams: params,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListMenuItemDTO>():
        final items = res.data.data;
        final totalCount = res.totalCountHeader ?? items.length;
        log.info(
          'Fetched ${items.length} menu items for shop $shopId '
          '(category: $categoryId).',
        );
        return PageResponse(
          req: pageRequest,
          items: items,
          totalCount: totalCount,
        );
      case NetworkErrorResult<ApiResponseListMenuItemDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListMenuItemDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }
}
