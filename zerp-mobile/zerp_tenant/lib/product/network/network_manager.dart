import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';

@injectable
class NetworkManager {
  NetworkManager(this._cubitAuth, this._authStorageService)
    : apiInvoker = DioNetworkInvoker.fromDio(
        Dio(
          BaseOptions(baseUrl: 'https://zerpapi.femrek.dev'),
        ),
      ),
      remoteLogInvoker = DioNetworkInvoker.fromBaseUrl(
        'https://dev.logger.femrek.dev',
      ) {
    apiInvoker.dio.interceptors.add(
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
          }
          handler.next(error);
        },
      ),
    );
  }

  final DioNetworkInvoker apiInvoker;
  final DioNetworkInvoker remoteLogInvoker;

  final CubitAuth _cubitAuth;
  final AuthStorageService _authStorageService;

  Future<void>? _ongoingUnauthorizedCheck;

  Future<void> _checkSessionAfterUnauthorized() async {
    final ongoingCheck = _ongoingUnauthorizedCheck;
    if (ongoingCheck != null) {
      await ongoingCheck;
      return;
    }

    final checkFuture = _cubitAuth.checkAuthRemote().whenComplete(() {
      _ongoingUnauthorizedCheck = null;
    });

    _ongoingUnauthorizedCheck = checkFuture;
    await checkFuture;
  }
}
