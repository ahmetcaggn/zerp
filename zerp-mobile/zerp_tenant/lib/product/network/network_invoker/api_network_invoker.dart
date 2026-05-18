import 'dart:async';

import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/network/api_url_helper.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';

@lazySingleton
final class ApiNetworkInvoker extends DioNetworkInvoker
    with LoggerMixin<ApiNetworkInvoker> {
  ApiNetworkInvoker(this._cubitAuth, this._authStorageService)
    : super.fromDio(
        Dio(
          BaseOptions(baseUrl: ApiUrlHelper.defaultBaseUrl),
        ),
      ) {
    dio.interceptors.add(
      QueuedInterceptorsWrapper(
        onRequest: (options, handler) async {
          final accessToken = await _authStorageService.accessToken;
          if (accessToken != null) {
            options.headers['Authorization'] = 'Bearer $accessToken';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            await _checkSessionAfterUnauthorized();

            final options = error.requestOptions;
            final accessToken = await _authStorageService.accessToken;
            if (accessToken != null) {
              options.headers['Authorization'] = 'Bearer $accessToken';
            }

            try {
              final response = await dio.fetch<dynamic>(options);
              return handler.resolve(response);
            } on DioException catch (e) {
              return handler.next(e);
            }
          }
          handler.next(error);
        },
      ),
    );
  }

  void updateBaseUrl(String url) {
    dio.options.baseUrl = url;
    log.info('API base URL updated to: $url');
  }

  final CubitAuth _cubitAuth;
  final AuthStorageService _authStorageService;

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
          result.error,
          result.error.stackTrace,
        );
      case SpecifiedResponseResult<T>():
        log.warning(
          'Request ${request.runtimeType} received unsuccessful response: '
          'Status code: ${result.statusCode}',
        );
    }
    log.fine(
      'Received response for request: ${request.runtimeType} '
      'with result: $result',
    );
    return result;
  }

  Future<void>? _ongoingUnauthorizedCheck;

  Future<void> _checkSessionAfterUnauthorized() async {
    if (_ongoingUnauthorizedCheck != null) {
      await _ongoingUnauthorizedCheck;
      return;
    }

    final completer = Completer<void>();
    _ongoingUnauthorizedCheck = completer.future;

    try {
      await _cubitAuth.checkAuthRemote();
    } on Object catch (e, s) {
      log.severe('Error checking auth remote: $e', e, s);
    } finally {
      _ongoingUnauthorizedCheck = null;
      completer.complete();
    }
  }
}
