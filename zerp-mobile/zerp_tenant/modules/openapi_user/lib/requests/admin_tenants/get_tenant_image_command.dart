//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';



///
/// GET /user/tenants/{id}/image
class GetTenantImageCommand extends OpenapiDefinitionBaseRequest<BinarySchema> {
  GetTenantImageCommand({
    required this.id,
    this.binaryResponseType = const InMemoryBinaryResponse(),
  });

  final String id;

  @override
  final BinaryResponseType binaryResponseType;

  @override
  String get path {
    var p = r'/user/tenants/{id}/image';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<BinarySchema> get defaultResponseFactory => BinarySchemaFactory(binaryResponseType: binaryResponseType);

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: BinarySchemaFactory(binaryResponseType: binaryResponseType),
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
