import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:injectable/injectable.dart';

@lazySingleton
final class RemoteLogNetworkInvoker extends DioNetworkInvoker {
  RemoteLogNetworkInvoker()
    : super.fromBaseUrl('https://dev.logger.femrek.dev');
}
