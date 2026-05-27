//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_stock_overview_dto.dart';


///
/// GET /resource/stock-resources/overview
class OverviewCommand extends OpenapiDefinitionBaseRequest<ApiResponseListStockOverviewDTO> {
  OverviewCommand({
    required this.shopId,
  });

  final String shopId;

  @override
  String get path {
    var p = r'/resource/stock-resources/overview';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'shopId', value: shopId),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseListStockOverviewDTO> get defaultResponseFactory => ApiResponseListStockOverviewDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListStockOverviewDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
