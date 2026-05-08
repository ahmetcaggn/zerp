//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_stock_movement_dto.dart';
import '../../model/stock_movement_create_dto.dart';


/// Request schema for [UpdateStockMovementCommand].
class UpdateStockMovementRequestSchema extends JsonRequestSchema {
  const UpdateStockMovementRequestSchema({required this.data});

  final StockMovementCreateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /resource/stock-movements/{id}
class UpdateStockMovementCommand extends OpenapiDefinitionBaseRequest<ApiResponseStockMovementDTO> {
  UpdateStockMovementCommand({
    required this.id,
    required StockMovementCreateDTO stockMovementCreateDTO,
  }) : _payload = UpdateStockMovementRequestSchema(data: stockMovementCreateDTO);

  /// Unique identifier of the entity to update
  final String id;

  final UpdateStockMovementRequestSchema _payload;

  @override
  String get path {
    var p = r'/resource/stock-movements/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

  @override
  SchemaFactory<ApiResponseStockMovementDTO> get defaultResponseFactory => ApiResponseStockMovementDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseStockMovementDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
