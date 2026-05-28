import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/service_base.dart';

@lazySingleton
class ShopService extends ServiceBase with LoggerMixin<ShopService> {
  ShopService({
    required super.invoker,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  Future<ShopDTO> getShop({required String id}) async {
    final command = GetOneShopCommand(id: id);
    final res = await invoker.send(command);

    switch (res) {
      case SuccessResponseResult<ApiResponseShopDTO>():
        final shop = res.data.data;
        if (shop == null) {
          throw Exception('Shop data is null');
        }
        return shop;
      case NetworkErrorResult<ApiResponseShopDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseShopDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }
}
