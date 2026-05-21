import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/api_status/model/actuator_status.dart';
import 'package:zerp_tenant/product/service/api_status/model/api_status_request_command.dart';
import 'package:zerp_tenant/product/service/api_status/model/api_status_response_schema.dart';
import 'package:zerp_tenant/product/service/service_base.dart';

@lazySingleton
final class ApiStatusService extends ServiceBase
    with LoggerMixin<ApiStatusService> {
  ApiStatusService({
    required super.invoker,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  /// Now returns [ActuatorStatus] instead of a boolean to give the caller
  /// more context about the exact state of the server.
  Future<ActuatorStatus> checkApiStatus() async {
    try {
      final response = await invoker.send(ApiStatusCheckCommand());

      switch (response) {
        case SuccessResponseResult<ApiStatusCheckResponseSchema>():
          // Successfully parsed the actuator response
          return response.data.status;

        case NetworkErrorResult<ApiStatusCheckResponseSchema>():
          log.severe('API status check network error: ${response.error}');
          return ActuatorStatus.down;

        case SpecifiedResponseResult<ApiStatusCheckResponseSchema>():
          log.warning(
            'API status check returned a specified status code: '
            '${response.statusCode}',
          );
          final statusCode = response.statusCode;
          if (statusCode >= 400 && statusCode < 500) {
            // Any 4xx client error (e.g. 401 Unauthorized, 403 Forbidden,
            // 404 Not Found) proves that the API host is up and active,
            // even if the specific health actuator route is secured,
            // disabled, or not configured.
            return ActuatorStatus.up;
          }
          return ActuatorStatus.down;
      }
    } on Object catch (e, s) {
      log.severe('API status check failed: $e', e, s);
      return ActuatorStatus.unknown;
    }
  }
}
