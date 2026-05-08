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
import '../../model/product_recipe_create_dto.dart';


/// Request schema for [CreateProductRecipeCommand].
class CreateProductRecipeRequestSchema extends JsonRequestSchema {
  const CreateProductRecipeRequestSchema({required this.data});

  final ProductRecipeCreateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /sale/product-recipes
class CreateProductRecipeCommand extends OpenapiDefinitionBaseRequest<ApiResponseProductRecipeDTO> {
  CreateProductRecipeCommand({
    required ProductRecipeCreateDTO productRecipeCreateDTO,
  }) : _payload = CreateProductRecipeRequestSchema(data: productRecipeCreateDTO);


  final CreateProductRecipeRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/product-recipes';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

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
