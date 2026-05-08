//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_menu_item_dto.dart';
import '../../model/menu_item_update_dto.dart';


/// Request schema for [UpdateMenuItemCommand].
class UpdateMenuItemRequestSchema extends JsonRequestSchema {
  const UpdateMenuItemRequestSchema({required this.data});

  final MenuItemUpdateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /sale/menu-items/{id}
class UpdateMenuItemCommand extends OpenapiDefinitionBaseRequest<ApiResponseMenuItemDTO> {
  UpdateMenuItemCommand({
    required this.id,
    required MenuItemUpdateDTO menuItemUpdateDTO,
  }) : _payload = UpdateMenuItemRequestSchema(data: menuItemUpdateDTO);

  /// Unique identifier of the entity to update
  final String id;

  final UpdateMenuItemRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/menu-items/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

  @override
  SchemaFactory<ApiResponseMenuItemDTO> get defaultResponseFactory => ApiResponseMenuItemDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseMenuItemDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
