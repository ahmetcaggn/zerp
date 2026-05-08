//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_menu_category_dto.dart';


/// GetOne: Get single entity by ID
/// Retrieves a single entity by its unique identifier. Implements ra-spring-data-provider's getOne operation. 
///
/// GET /sale/menu-categories/{id}
class GetOneMenuCategoryCommand extends OpenapiDefinitionBaseRequest<ApiResponseMenuCategoryDTO> {
  GetOneMenuCategoryCommand({
    required this.id,
  });

  /// Unique identifier of the entity to retrieve
  final String id;

  @override
  String get path {
    var p = r'/sale/menu-categories/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseMenuCategoryDTO> get defaultResponseFactory => ApiResponseMenuCategoryDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseMenuCategoryDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
