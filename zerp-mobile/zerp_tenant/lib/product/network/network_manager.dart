import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:injectable/injectable.dart';

@injectable
class NetworkManager {
  NetworkManager()
    : apiInvoker = DioNetworkInvoker.fromBaseUrl('https://api.example.com');

  final DioNetworkInvoker apiInvoker;
}
