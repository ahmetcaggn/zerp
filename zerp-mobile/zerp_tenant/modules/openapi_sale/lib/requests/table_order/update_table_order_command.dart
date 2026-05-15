//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_table_order_dto.dart';
import '../../model/table_order_update_dto.dart';


/// Request schema for [UpdateTableOrderCommand].
class UpdateTableOrderRequestSchema extends JsonRequestSchema {
  const UpdateTableOrderRequestSchema({required this.data});

  final TableOrderUpdateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /sale/table-orders/{id}
class UpdateTableOrderCommand extends OpenapiDefinitionBaseRequest<ApiResponseTableOrderDTO> {
  UpdateTableOrderCommand({
    required this.id,
    required TableOrderUpdateDTO tableOrderUpdateDTO,
  }) : _payload = UpdateTableOrderRequestSchema(data: tableOrderUpdateDTO);

  /// Unique identifier of the entity to update
  final String id;

  final UpdateTableOrderRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/table-orders/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

  @override
  SchemaFactory<ApiResponseTableOrderDTO> get defaultResponseFactory => ApiResponseTableOrderDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseTableOrderDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
