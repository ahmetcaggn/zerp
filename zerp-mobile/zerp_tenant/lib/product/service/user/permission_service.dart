import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
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

  Future<ApiResponsePermissionResponse> createPermission({
    required PermissionCreateRequestDTO request,
  }) async {
    final command = CreatePermissionCommand(
      permissionCreateRequestDTO: request,
    );
    final res = await invoker.send(command);

    switch (res) {
      case SuccessResponseResult<ApiResponsePermissionResponse>():
        log.info('Successfully created permission: ${res.data.data?.id}');
        return res.data;
      case NetworkErrorResult<ApiResponsePermissionResponse>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponsePermissionResponse>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<ApiResponsePermissionResponse> updatePermission({
    required int id,
    required PermissionUpdateRequest request,
  }) async {
    final command = UpdatePermissionCommand(
      id: id,
      permissionUpdateRequest: request,
    );
    final res = await invoker.send(command);

    switch (res) {
      case SuccessResponseResult<ApiResponsePermissionResponse>():
        log.info('Successfully updated permission: ${res.data.data?.id}');
        return res.data;
      case NetworkErrorResult<ApiResponsePermissionResponse>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponsePermissionResponse>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<ApiResponseMapPermissionActionListPermissionTargetType>
  getPermissionActions() async {
    final command = GetAllPermissionsCommand();
    final res = await invoker.send(command);

    switch (res) {
      case SuccessResponseResult<
        ApiResponseMapPermissionActionListPermissionTargetType
      >():
        log.info('Successfully fetched permission actions');
        return res.data;
      case NetworkErrorResult<
        ApiResponseMapPermissionActionListPermissionTargetType
      >():
        throw onNetworkError(res);
      case SpecifiedResponseResult<
        ApiResponseMapPermissionActionListPermissionTargetType
      >():
        throw onUnsuccessfulResponse(res);
    }
  }

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

        log.info(
          'Fetched ${permissions.length} permissions. '
          '(total count: $totalCount)',
        );
        return PageResponse(
          req: pageRequest,
          items: permissions,
          totalCount: totalCount,
        );

      case NetworkErrorResult<ApiResponseListPermissionResponse>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListPermissionResponse>():
        throw onUnsuccessfulResponse(res);
    }
  }
}
