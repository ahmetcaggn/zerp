//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_stock_resource_dto.dart';
import '../../model/stock_resource_update_dto.dart';


/// Request schema for [UpdateStockResourceCommand].
class UpdateStockResourceRequestSchema extends JsonRequestSchema {
  const UpdateStockResourceRequestSchema({required this.data});

  final StockResourceUpdateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /{id}
class UpdateStockResourceCommand extends OpenapiDefinitionBaseRequest<ApiResponseStockResourceDTO> {
  UpdateStockResourceCommand({
    required this.id,
    required StockResourceUpdateDTO stockResourceUpdateDTO,
  }) : _payload = UpdateStockResourceRequestSchema(data: stockResourceUpdateDTO);

  /// Unique identifier of the entity to update
  final String id;

  final UpdateStockResourceRequestSchema _payload;

  @override
  String get path {
    var p = r'/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

  @override
  SchemaFactory<ApiResponseStockResourceDTO> get defaultResponseFactory => ApiResponseStockResourceDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseStockResourceDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
