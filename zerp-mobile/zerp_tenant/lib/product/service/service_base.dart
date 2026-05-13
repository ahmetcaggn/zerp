import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
import 'package:zerp_tenant/product/error/unauthenticated_exception.dart';
import 'package:zerp_tenant/product/network/network_manager.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';

abstract class ServiceBase {
  ServiceBase({
    required this.networkManager,
    required this.authStorageService,
    required this.cubitError,
    required this.cubitAuth,
  });

  late final Logger _log = logger('ServiceBase');

  final NetworkManager networkManager;
  final AuthStorageService authStorageService;
  final CubitError cubitError;
  final CubitAuth cubitAuth;

  DioNetworkInvoker get invoker => networkManager.apiInvoker;

  Future<String> getUserId() async {
    late final String userId;
    final claims = await authStorageService.authClaimsIfValid;
    if (claims != null) {
      userId = claims.sub;
      _log.info('Found valid auth claims for userId: $userId');
    } else {
      _log.warning(
        'No valid auth claims found. '
        'Attempting to check auth remotely to refresh claims.',
      );
      await cubitAuth.checkAuthRemote();
      _log.fine('Finished remote auth check, trying to get claims again');
      final newClaims = await authStorageService.authClaimsIfValid;
      if (newClaims != null) {
        userId = newClaims.sub;
        _log.info(
          'Found valid auth claims after remote check for userId: $userId',
        );
      } else {
        _log.warning(
          'Still no valid auth claims found after remote check. '
          'User is unauthenticated.',
        );
        throw UnauthenticatedException(
          'No valid authentication to fetch permissions',
        );
      }
    }

    return userId;
  }

  NetworkErrorBase onNetworkError<T extends Schema>(NetworkErrorResult<T> res) {
    _log.warning(
      'Network error while fetching $T: ${res.error.message}',
      res.error,
      res.error.stackTrace,
    );
    if (res.error is! RequestCancelledError) {
      cubitError.enqueue(
        ErrorToPresent(
          message: 'Failed to fetch $T: ${res.error.message}',
        ),
      );
    }
    return res.error;
  }

  Exception onUnsuccessfulResponse<T extends Schema>(
    SpecifiedResponseResult<T> res,
  ) {
    _log.warning(
      'Unsuccessful response while fetching $T: ${res.statusCode} ${res.type}',
    );
    cubitError.enqueue(
      ErrorToPresent(
        message: 'Failed to fetch $T: ${res.statusCode} ${res.type}',
      ),
    );
    return Exception('Unsuccessful response: ${res.statusCode} ${res.type}');
  }
}
