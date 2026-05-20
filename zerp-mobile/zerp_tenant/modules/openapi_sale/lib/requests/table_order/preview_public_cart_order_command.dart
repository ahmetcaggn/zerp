//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/public_cart_order_preview_dto.dart';


///
/// GET /sale/table-orders/public-cart-orders/preview
class PreviewPublicCartOrderCommand extends OpenapiDefinitionBaseRequest<PublicCartOrderPreviewDTO> {
  PreviewPublicCartOrderCommand({
    required this.code,
    required this.tableId,
  });

  final String code;
  final String tableId;

  @override
  String get path {
    var p = r'/sale/table-orders/public-cart-orders/preview';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'code', value: code),
    QueryParameter(key: r'tableId', value: tableId),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<PublicCartOrderPreviewDTO> get defaultResponseFactory => PublicCartOrderPreviewDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: PublicCartOrderPreviewDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
