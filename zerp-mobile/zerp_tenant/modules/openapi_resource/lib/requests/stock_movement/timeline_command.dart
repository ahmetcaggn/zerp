//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_stock_movement_timeline_dto.dart';


///
/// GET /resource/stock-movements/timeline
class TimelineCommand extends OpenapiDefinitionBaseRequest<ApiResponseStockMovementTimelineDTO> {
  TimelineCommand({
    required this.shopId,
    required this.from,
    required this.to,
    this.stockResourceId,
    this.bucket,
  });

  final String shopId;
  final DateTime from;
  final DateTime to;
  final String? stockResourceId;
  final String? bucket;

  @override
  String get path {
    var p = r'/resource/stock-movements/timeline';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'shopId', value: shopId),
    if (stockResourceId != null) QueryParameter(key: r'stockResourceId', value: stockResourceId),
    QueryParameter(key: r'from', value: from),
    QueryParameter(key: r'to', value: to),
    if (bucket != null) QueryParameter(key: r'bucket', value: bucket),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseStockMovementTimelineDTO> get defaultResponseFactory => ApiResponseStockMovementTimelineDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseStockMovementTimelineDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
