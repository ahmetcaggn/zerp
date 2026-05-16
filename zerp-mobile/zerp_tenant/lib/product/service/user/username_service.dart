import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
import 'package:zerp_tenant/product/error/http_exception.dart';
import 'package:zerp_tenant/product/service/service_base.dart';

@lazySingleton
final class UsernameService extends ServiceBase
    with LoggerMixin<UsernameService> {
  UsernameService({
    required super.invoker,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  Future<bool> isUsernameAvailable(CheckUsernameCommand request) async {
    log.fine('Checking availability of username: ${request.username}');

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseUsernameCheckResponseDTO>():
        final result = res.data.data?.available;
        if (result == null) {
          cubitError.enqueue(
            const ErrorToPresent(
              message: 'Username availability could not be checked.',
            ),
          );
          throw HttpException(
            message:
                'Username availability could not be checked: '
                '${res.data.message}',
            statusCode: res.statusCode,
          );
        }

        log.info(
          'Username "${request.username}" is '
          '${result ? 'available' : 'not available'}.',
        );
        return result;

      case NetworkErrorResult<ApiResponseUsernameCheckResponseDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseUsernameCheckResponseDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }
}
