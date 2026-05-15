//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/stock_movement_feign_request.dart';


/// Request schema for [CreateBulkCommand].
class CreateBulkRequestSchema extends JsonRequestSchema {
  const CreateBulkRequestSchema({required this.data});

  final List<StockMovementFeignRequest> data;

  @override
  dynamic toJsonPayload() => data.map((e) => e.toJson()).toList();
}

///
/// POST /feign/resource/stock-movements/bulk
class CreateBulkCommand extends OpenapiDefinitionBaseRequest<IgnoredSchema> {
  CreateBulkCommand({
    required List<StockMovementFeignRequest> stockMovementFeignRequest,
  }) : _payload = CreateBulkRequestSchema(data: stockMovementFeignRequest);


  final CreateBulkRequestSchema _payload;

  @override
  String get path {
    var p = r'/feign/resource/stock-movements/bulk';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<IgnoredSchema> get defaultResponseFactory => IgnoredSchema.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: IgnoredSchema.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
