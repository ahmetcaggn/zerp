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
import '../../model/menu_category_update_dto.dart';


/// Request schema for [UpdateMenuCategoryCommand].
class UpdateMenuCategoryRequestSchema extends JsonRequestSchema {
  const UpdateMenuCategoryRequestSchema({required this.data});

  final MenuCategoryUpdateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /sale/menu-categories/{id}
class UpdateMenuCategoryCommand extends OpenapiDefinitionBaseRequest<ApiResponseMenuCategoryDTO> {
  UpdateMenuCategoryCommand({
    required this.id,
    required MenuCategoryUpdateDTO menuCategoryUpdateDTO,
  }) : _payload = UpdateMenuCategoryRequestSchema(data: menuCategoryUpdateDTO);

  /// Unique identifier of the entity to update
  final String id;

  final UpdateMenuCategoryRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/menu-categories/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

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
      _payload;
}
