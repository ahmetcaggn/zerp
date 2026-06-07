import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/error/http_exception.dart';
import 'package:zerp_tenant/product/service/service_base.dart';

@lazySingleton
final class UserProfileService extends ServiceBase
    with LoggerMixin<UserProfileService> {
  UserProfileService({
    required super.invoker,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  Future<CurrentUserProfileDTO> getCurrentUserProfile() async {
    final command = GetCurrentUserCommand();
    final res = await invoker.send(command);

    switch (res) {
      case SuccessResponseResult<ApiResponseCurrentUserProfileDTO>():
        final profile = res.data.data;
        if (profile == null) {
          throw HttpException(
            message: 'Current user profile is null: ${res.data.message}',
            statusCode: res.statusCode,
          );
        }
        log.info('Successfully fetched current user profile for: ${profile.username}');
        return profile;
      case NetworkErrorResult<ApiResponseCurrentUserProfileDTO>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseCurrentUserProfileDTO>():
        throw onUnsuccessfulResponse(res);
    }
  }
}
