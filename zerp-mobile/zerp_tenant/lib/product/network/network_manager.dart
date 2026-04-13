import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:injectable/injectable.dart';

@injectable
class NetworkManager {
  NetworkManager()
    : apiInvoker = DioNetworkInvoker.fromBaseUrl('https://api.example.com'),
      remoteLogInvoker = DioNetworkInvoker.fromBaseUrl(
        'https://dev.logger.femrek.dev',
      );

  // remoteLogInvoker = DioNetworkInvoker.fromDio(
  //   Dio(
  //     BaseOptions(
  //       baseUrl: 'https://dev.logger.femrek.dev',
  //       connectTimeout: const Duration(seconds: 8),
  //     ),
  //   ),
  // );

  final DioNetworkInvoker apiInvoker;
  final DioNetworkInvoker remoteLogInvoker;
}
