//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_stock_operation_dto.dart';
import '../../model/stock_entry_create_dto.dart';


/// Request schema for [CreateEntryCommand].
class CreateEntryRequestSchema extends JsonRequestSchema {
  const CreateEntryRequestSchema({required this.data});

  final StockEntryCreateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /resource/stock-operations/entries
class CreateEntryCommand extends OpenapiDefinitionBaseRequest<ApiResponseStockOperationDTO> {
  CreateEntryCommand({
    required StockEntryCreateDTO stockEntryCreateDTO,
  }) : _payload = CreateEntryRequestSchema(data: stockEntryCreateDTO);


  final CreateEntryRequestSchema _payload;

  @override
  String get path {
    var p = r'/resource/stock-operations/entries';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponseStockOperationDTO> get defaultResponseFactory => ApiResponseStockOperationDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseStockOperationDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
