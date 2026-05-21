import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:zerp_tenant/product/service/api_status/model/actuator_status.dart';

final class ApiStatusCheckResponseSchema extends Schema {
  ApiStatusCheckResponseSchema({
    required this.status,
  });

  final ActuatorStatus status;

  static const factory = _ApiStatusCheckResponseSchemaFactory();
}

final class _ApiStatusCheckResponseSchemaFactory
    extends JsonSchemaFactory<ApiStatusCheckResponseSchema> {
  const _ApiStatusCheckResponseSchemaFactory();

  @override
  ApiStatusCheckResponseSchema fromJson(dynamic json) {
    if (json is! Map<String, dynamic>) {
      throw FormatException(
        'Expected a JSON object to deserialize ApiStatusCheckResponseSchema, '
        'but got: $json',
      );
    }

    return ApiStatusCheckResponseSchema(
      // Parse the string into our strongly-typed enum
      status: ActuatorStatus.fromString(json['status'] as String?),
    );
  }
}
