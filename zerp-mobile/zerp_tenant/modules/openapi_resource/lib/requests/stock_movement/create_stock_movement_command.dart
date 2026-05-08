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


/// Request schema for [CreateStockMovementCommand].
class CreateStockMovementRequestSchema extends JsonRequestSchema {
  const CreateStockMovementRequestSchema({required this.data});

  final StockMovementCreateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /resource/stock-movements
class CreateStockMovementCommand extends OpenapiDefinitionBaseRequest<ApiResponseStockMovementDTO> {
  CreateStockMovementCommand({
    required StockMovementCreateDTO stockMovementCreateDTO,
  }) : _payload = CreateStockMovementRequestSchema(data: stockMovementCreateDTO);


  final CreateStockMovementRequestSchema _payload;

  @override
  String get path {
    var p = r'/resource/stock-movements';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

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
