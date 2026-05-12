import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/error_to_present.dart';
import 'package:zerp_tenant/product/error/http_exception.dart';
import 'package:zerp_tenant/product/error/unauthenticated_exception.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/service_base.dart';
import 'package:zerp_tenant/product/util/network_result_extension.dart';

@lazySingleton
final class PermissionService extends ServiceBase
    with LoggerMixin<PermissionService> {
  PermissionService({
    required super.networkManager,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  Future<PageResponse<PermissionResponse>> getAllOwnedPermissions([
    PageRequest pageRequest = PageRequest.all,
  ]) async {
    late final String userId;
    try {
      userId = await getUserId();
    } on UnauthenticatedException catch (e) {
      log.warning('User is unauthenticated: $e');
      cubitError.enqueue(
        const ErrorToPresent(
          message: 'Failed to get user ID: User is unauthenticated',
        ),
      );
      rethrow;
    } on Object catch (e) {
      log.severe('Error getting user ID: $e');
      cubitError.enqueue(
        ErrorToPresent(
          message: 'Failed to get user ID: $e',
        ),
      );
      rethrow;
    }

    return _getPermissions(
      pageRequest: pageRequest,
      additionalParams: {'userId.eq': userId},
    );
  }

  Future<PageResponse<PermissionResponse>> getPermissionsOfUser({
    required String userId,
    PageRequest pageRequest = PageRequest.all,
  }) async {
    return _getPermissions(
      pageRequest: pageRequest,
      additionalParams: {'userId.eq': userId},
    );
  }

  Future<PageResponse<PermissionResponse>> _getPermissions({
    required PageRequest pageRequest,
    required Map<String, String> additionalParams,
  }) async {
    final res = await invoker.send(
      GetListPermissionsCommand(
        start: pageRequest.start,
        end: pageRequest.end,
        allParams: additionalParams,
      ),
    );

    switch (res) {
      case NetworkErrorResult<ApiResponseListPermissionResponse>():
        log.warning(
          'Network error while fetching permissions: ${res.error.message}',
          res.error,
        );
        cubitError.enqueue(
          ErrorToPresent(
            message: 'Failed to fetch permissions: ${res.error.message}',
          ),
        );
        throw res.error;

      case SuccessResponseResult<ApiResponseListPermissionResponse>():
        final permissions = res.data.data;
        final totalCount = res.totalCountHeader;
        if (totalCount == null) {
          log.severe('Total count header is missing in the response');
          cubitError.enqueue(
            const ErrorToPresent(
              message: 'Total count of permissions is missing in the response',
            ),
          );
        }

        log.info('Fetched ${permissions.length} permissions');
        return PageResponse(
          req: pageRequest,
          items: permissions,
          totalCount: totalCount,
        );

      case SpecifiedResponseResult<ApiResponseListPermissionResponse>():
        log.warning('Received unsuccessful response: ${res.statusCode}');
        cubitError.enqueue(
          ErrorToPresent(
            message: 'Failed to fetch permissions: ${res.statusCode}',
          ),
        );
        throw HttpException(
          message: 'Failed to fetch permissions',
          statusCode: res.statusCode,
        );
    }
  }
}
