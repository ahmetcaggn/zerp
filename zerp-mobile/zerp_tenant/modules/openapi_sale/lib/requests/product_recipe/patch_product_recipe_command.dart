//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_product_recipe_dto.dart';


/// Request schema for [PatchProductRecipeCommand].
class PatchProductRecipeRequestSchema extends JsonRequestSchema {
  const PatchProductRecipeRequestSchema({required this.data});

  final Map<String, Object> data;

  @override
  dynamic toJsonPayload() => data;
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PATCH /sale/product-recipes/{id}
class PatchProductRecipeCommand extends OpenapiDefinitionBaseRequest<ApiResponseProductRecipeDTO> {
  PatchProductRecipeCommand({
    required this.id,
    required Map<String, Object> requestBody,
  }) : _payload = PatchProductRecipeRequestSchema(data: requestBody);

  /// Unique identifier of the entity to update
  final String id;

  final PatchProductRecipeRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/product-recipes/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.patch;

  @override
  SchemaFactory<ApiResponseProductRecipeDTO> get defaultResponseFactory => ApiResponseProductRecipeDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseProductRecipeDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
