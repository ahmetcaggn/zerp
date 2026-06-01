//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_public_shop_dto.dart';


///
/// GET /sale/public/shops/nearby
class GetNearbyShopsCommand extends OpenapiDefinitionBaseRequest<ApiResponseListPublicShopDTO> {
  GetNearbyShopsCommand({
    required this.lat,
    required this.lng,
    this.start,
    this.end,
    this.limit,
  });

  final double lat;
  final double lng;
  final int? start;
  final int? end;
  final int? limit;

  @override
  String get path {
    var p = r'/sale/public/shops/nearby';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'lat', value: lat),
    QueryParameter(key: r'lng', value: lng),
    if (start != null) QueryParameter(key: r'_start', value: start),
    if (end != null) QueryParameter(key: r'_end', value: end),
    if (limit != null) QueryParameter(key: r'limit', value: limit),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseListPublicShopDTO> get defaultResponseFactory => ApiResponseListPublicShopDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListPublicShopDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
