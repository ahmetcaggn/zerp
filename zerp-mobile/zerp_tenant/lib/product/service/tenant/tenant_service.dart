import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/service_base.dart';

@lazySingleton
class TenantService extends ServiceBase with LoggerMixin<TenantService> {
  TenantService({
    required super.invoker,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  Future<TenantResponseDTO> getTenant({required String id}) async {
    final command = GetOneAdminTenantCommand(id: id);
    final res = await invoker.send(command);

    switch (res) {
      case SuccessResponseResult<ApiResponseTenantResponseDTO>():
        final tenant = res.data.data;
        if (tenant == null) {
          throw Exception('Tenant data is null');
        }
        return tenant;
      case NetworkErrorResult<ApiResponseTenantResponseDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseTenantResponseDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }
}
