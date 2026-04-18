import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';
import 'package:zerp_tenant/product/service/auth_service.dart';

@injectable
class NetworkManager {
  NetworkManager(this._authService, this._cubitAuth)
    : apiInvoker = DioNetworkInvoker.fromDio(
        Dio(
          BaseOptions(
            baseUrl: 'https://dev.api.femrek.dev',
          ),
        ),
      ),
      remoteLogInvoker = DioNetworkInvoker.fromBaseUrl(
        'https://dev.logger.femrek.dev',
      ) {
    apiInvoker.dio.interceptors.add(
      QueuedInterceptorsWrapper(
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

  final AuthService _authService;
  final CubitAuth _cubitAuth;

  Future<void>? _ongoingUnauthorizedCheck;

  Future<void> _checkSessionAfterUnauthorized() async {
    final ongoingCheck = _ongoingUnauthorizedCheck;
    if (ongoingCheck != null) {
      await ongoingCheck;
      return;
    }

    final checkFuture = _authService
        .checkSessionOnlineStatus()
        .then((status) async {
          if (status == AuthSessionOnlineStatus.invalid) {
            await _authService.logout();
            _cubitAuth.emit(const StateAuthUnauthenticated());
          }
        })
        .whenComplete(() {
          _ongoingUnauthorizedCheck = null;
        });

    _ongoingUnauthorizedCheck = checkFuture;
    await checkFuture;
  }
}
