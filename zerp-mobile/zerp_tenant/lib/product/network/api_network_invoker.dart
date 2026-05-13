import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:remote_logging/remote_logging.dart';

final class ApiNetworkInvoker extends DioNetworkInvoker
    with LoggerMixin<ApiNetworkInvoker> {
  ApiNetworkInvoker.fromDio(super.dio) : super.fromDio();

  @override
  Future<NetworkResult<T>> send<T extends Schema>(
    RequestCommand<T> request,
  ) async {
    log.fine(
      'Sending request: ${request.runtimeType} '
      'with data: ${request.payload.toLogString()}',
    );
    final result = await super.send(request);

    switch (result) {
      case SuccessResponseResult<T>():
        log.info(
          'Request ${request.runtimeType} succeeded with status code: '
          '${result.statusCode}',
        );
      case NetworkErrorResult<T>():
        log.warning(
          'Request ${request.runtimeType} failed with network error: '
          '${result.error}',
        );
      case SpecifiedResponseResult<T>():
        log.warning(
          'Request ${request.runtimeType} received unsuccessful response: '
          'Status code: ${result.statusCode}, '
          'Message: ${result.data}',
        );
    }
    log.fine(
      'Received response for request: ${request.runtimeType} '
      'with result: $result',
    );
    return result;
  }
}
