import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';

extension NetworkResultExtension on NetworkResult {
  int? get totalCountHeader {
    if (this is SpecifiedResponseResult) {
      final specifiedResult = this as SpecifiedResponseResult;
      final totalCountHeaderValue =
          specifiedResult.headers['X-Total-Count']?.first;
      if (totalCountHeaderValue != null) {
        return int.tryParse(totalCountHeaderValue);
      }
    }
    return null;
  }
}
