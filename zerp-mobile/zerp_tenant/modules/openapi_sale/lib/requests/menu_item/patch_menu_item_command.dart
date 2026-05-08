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


/// Request schema for [PatchMenuItemCommand].
class PatchMenuItemRequestSchema extends JsonRequestSchema {
  const PatchMenuItemRequestSchema({required this.data});

  final Map<String, Object> data;

  @override
  dynamic toJsonPayload() => data;
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PATCH /sale/menu-items/{id}
class PatchMenuItemCommand extends OpenapiDefinitionBaseRequest<ApiResponseMenuItemDTO> {
  PatchMenuItemCommand({
    required this.id,
    required Map<String, Object> requestBody,
  }) : _payload = PatchMenuItemRequestSchema(data: requestBody);

  /// Unique identifier of the entity to update
  final String id;

  final PatchMenuItemRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/menu-items/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.patch;

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
