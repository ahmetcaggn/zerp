import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';

extension QueryParameterExtensions on List<QueryParameter> {
  String toStringValue() {
    if (isEmpty) return '';
    final buffer = StringBuffer();
    for (var i = 0; i < length - 1; i++) {
      final param = this[i];
      buffer.write('${param.key}=${param.value}&');
    }
    if (isNotEmpty) {
      final lastParam = this[length - 1];
      buffer.write('${lastParam.key}=${lastParam.value}');
    }

    return buffer.toString();
  }
}
