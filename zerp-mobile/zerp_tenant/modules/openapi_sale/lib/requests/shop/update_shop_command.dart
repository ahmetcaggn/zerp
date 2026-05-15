//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_shop_dto.dart';


/// Request schema for [UpdateShopCommand].
class UpdateShopRequestSchema extends JsonRequestSchema {
  const UpdateShopRequestSchema({required this.data});

  final Object data;

  @override
  dynamic toJsonPayload() => data;
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /sale/shops/{id}
class UpdateShopCommand extends OpenapiDefinitionBaseRequest<ApiResponseShopDTO> {
  UpdateShopCommand({
    required this.id,
    required Object body,
  }) : _payload = UpdateShopRequestSchema(data: body);

  /// Unique identifier of the entity to update
  final String id;

  final UpdateShopRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/shops/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

  @override
  SchemaFactory<ApiResponseShopDTO> get defaultResponseFactory => ApiResponseShopDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseShopDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
