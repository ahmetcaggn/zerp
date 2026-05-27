//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_stock_movement_dto.dart';


///
/// GET /resource/stock-movements/drill-down
class DrillDownCommand extends OpenapiDefinitionBaseRequest<ApiResponseListStockMovementDTO> {
  DrillDownCommand({
    required this.shopId,
    required this.from,
    required this.to,
    this.stockResourceId,
    this.limit,
  });

  final String shopId;
  final DateTime from;
  final DateTime to;
  final String? stockResourceId;
  final int? limit;

  @override
  String get path {
    var p = r'/resource/stock-movements/drill-down';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'shopId', value: shopId),
    if (stockResourceId != null) QueryParameter(key: r'stockResourceId', value: stockResourceId),
    QueryParameter(key: r'from', value: from),
    QueryParameter(key: r'to', value: to),
    if (limit != null) QueryParameter(key: r'limit', value: limit),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseListStockMovementDTO> get defaultResponseFactory => ApiResponseListStockMovementDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListStockMovementDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
