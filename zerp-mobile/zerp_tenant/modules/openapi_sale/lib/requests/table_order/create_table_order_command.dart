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
import '../../model/table_order_create_dto.dart';


/// Request schema for [CreateTableOrderCommand].
class CreateTableOrderRequestSchema extends JsonRequestSchema {
  const CreateTableOrderRequestSchema({required this.data});

  final TableOrderCreateDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /sale/table-orders
class CreateTableOrderCommand extends OpenapiDefinitionBaseRequest<ApiResponseTableOrderDTO> {
  CreateTableOrderCommand({
    required TableOrderCreateDTO tableOrderCreateDTO,
  }) : _payload = CreateTableOrderRequestSchema(data: tableOrderCreateDTO);


  final CreateTableOrderRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/table-orders';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

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
