//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_product_dto.dart';


/// Request schema for [PatchProductCommand].
class PatchProductRequestSchema extends JsonRequestSchema {
  const PatchProductRequestSchema({required this.data});

  final Map<String, Object> data;

  @override
  dynamic toJsonPayload() => data;
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PATCH /sale/products/{id}
class PatchProductCommand extends OpenapiDefinitionBaseRequest<ApiResponseProductDTO> {
  PatchProductCommand({
    required this.id,
    required Map<String, Object> requestBody,
  }) : _payload = PatchProductRequestSchema(data: requestBody);

  /// Unique identifier of the entity to update
  final String id;

  final PatchProductRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/products/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.patch;

  @override
  SchemaFactory<ApiResponseProductDTO> get defaultResponseFactory => ApiResponseProductDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseProductDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
