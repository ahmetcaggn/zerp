import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:zerp_tenant/product/service/api_status/model/api_status_response_schema.dart';

final class ApiStatusCheckCommand
    extends RequestCommand<ApiStatusCheckResponseSchema> {
  @override
  SchemaFactory<Schema> get defaultErrorResponseFactory =>
      AnyDataSchema.factory;

  @override
  SchemaFactory<ApiStatusCheckResponseSchema> get defaultResponseFactory =>
      ApiStatusCheckResponseSchema.factory;

  @override
  String get path => '/actuator/health';
}
