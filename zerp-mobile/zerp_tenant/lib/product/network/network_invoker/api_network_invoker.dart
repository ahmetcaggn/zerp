import 'dart:async';

import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/network/api_url_helper.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';
import 'package:zerp_tenant/product/util/query_parameter_extensions.dart';

/// Key used in [RequestOptions.extra] to opt a request out of the
/// automatic 401 auth-refresh-and-retry flow.
///
/// Set `extra: {kSkipAuthRetry: true}` on a [RequestCommand]'s options
/// (e.g. via [RequestCommand.headers] side-channel or by setting the Dio
/// options directly) to prevent the interceptor from retrying the request
/// on a 401 response. Unauthenticated probe requests like `/actuator/health`
/// must use this to avoid an unhandled [DioException] on retry.
const String kSkipAuthRetry = 'skipAuthRetry';

// Private alias used inside this file.
const String _kSkipAuthRetry = kSkipAuthRetry;

@lazySingleton
final class ApiNetworkInvoker extends DioNetworkInvoker
    with LoggerMixin<ApiNetworkInvoker> {
  ApiNetworkInvoker(this._cubitAuth, this._authStorageService)
    : super.fromDio(
        Dio(
          BaseOptions(
            baseUrl: ApiUrlHelper.defaultBaseUrl,
            connectTimeout: const Duration(seconds: 15),
          ),
        ),
      ) {
    dio.interceptors.add(_DioLoggerInterceptor());
    dio.interceptors.add(
      QueuedInterceptorsWrapper(
        onRequest: (options, handler) async {
          // Paths that probe server reachability without authentication should
          // never trigger the 401-refresh-and-retry flow.
          final isUnauthenticatedProbe =
              options.path.startsWith('/actuator/');
          if (isUnauthenticatedProbe) {
            options.extra[_kSkipAuthRetry] = true;
            handler.next(options);
            return;
          }

          final accessToken = await _authStorageService.accessToken;
          if (accessToken != null) {
            options.headers['Authorization'] = 'Bearer $accessToken';
          }

          options.queryParameters = options.queryParameters.map((key, value) {
            if (value is DateTime) {
              return MapEntry(key, value.toIso8601String());
            }
            if (value is List) {
              return MapEntry(
                key,
                value
                    .map((e) => e is DateTime ? e.toIso8601String() : e)
                    .toList(),
              );
            }
            return MapEntry(key, value);
          });

          handler.next(options);
        },
        onError: (error, handler) async {
          // Skip the auth-refresh-and-retry flow for requests that have opted
          // out (e.g. the /actuator/health status check). Without this guard,
          // the retry throws a second DioException that escapes the library's
          // catch block and surfaces as an unhandled error.
          final skipRetry =
              error.requestOptions.extra[_kSkipAuthRetry] == true;

          if (!skipRetry && error.response?.statusCode == 401) {
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
      '${request.path}?${request.queryParameters.toStringValue()} '
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

final class _DioLoggerInterceptor extends LogInterceptor
    with LoggerMixin<_DioLoggerInterceptor> {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    log.fine(
      'Dio Request: ${options.method} ${options.uri} '
      'Headers: ${options.headers} '
      'Query Parameters: ${options.queryParameters} '
      'Data: ${options.data}',
    );
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    log.warning(
      'Dio Error: ${err.message} '
      'Request: ${err.requestOptions.method} ${err.requestOptions.uri} '
      'Headers: ${err.requestOptions.headers} '
      'Query Parameters: ${err.requestOptions.queryParameters} '
      'Data: ${err.requestOptions.data} '
      'Error Details: ${err.error}',
      err,
      err.stackTrace,
    );
    handler.next(err);
  }

  @override
  void onResponse(
    Response<dynamic> response,
    ResponseInterceptorHandler handler,
  ) {
    log.fine(
      'Dio Response: ${response.statusCode} ${response.requestOptions.method} '
      '${response.requestOptions.uri} '
      'Headers: ${response.headers} '
      'Query Parameters: ${response.requestOptions.queryParameters} '
      'Data: ${response.data}',
    );
    handler.next(response);
  }
}
