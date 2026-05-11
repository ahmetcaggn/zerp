import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/error_to_present.dart';
import 'package:zerp_tenant/product/error/http_exception.dart';
import 'package:zerp_tenant/product/error/unauthenticated_exception.dart';
import 'package:zerp_tenant/product/service/service_base.dart';

@injectable
final class PermissionService extends ServiceBase
    with LoggerMixin<PermissionService> {
  PermissionService({
    required super.networkManager,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  Future<List<PermissionResponse>> getAllOwnedPermissions() async {
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

    final res = await invoker.send(
      GetListPermissionsCommand(
        start: 0,
        end: 10_000,
        allParams: {'userId.eq': userId},
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
        log.info('Fetched ${permissions.length} permissions');
        return permissions;

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
