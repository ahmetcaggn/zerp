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
import '../../model/stock_resource_create_dto.dart';


/// Request schema for [CreateStockResourceCommand].
class CreateStockResourceRequestSchema extends JsonRequestSchema {
  const CreateStockResourceRequestSchema({required this.data});

  final StockResourceCreateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /resource/stock-resources
class CreateStockResourceCommand extends OpenapiDefinitionBaseRequest<ApiResponseStockResourceDTO> {
  CreateStockResourceCommand({
    required StockResourceCreateDTO stockResourceCreateDTO,
  }) : _payload = CreateStockResourceRequestSchema(data: stockResourceCreateDTO);


  final CreateStockResourceRequestSchema _payload;

  @override
  String get path {
    var p = r'/resource/stock-resources';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

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
