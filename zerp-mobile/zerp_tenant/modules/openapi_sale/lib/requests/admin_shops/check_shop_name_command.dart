//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_admin_shop_name_check_response_dto.dart';


///
/// GET /sale/admin/shops/check-name
class CheckShopNameCommand extends OpenapiDefinitionBaseRequest<ApiResponseAdminShopNameCheckResponseDTO> {
  CheckShopNameCommand({
    required this.tenantId,
    required this.name,
    this.shopId,
  });

  final String tenantId;
  final String name;
  final String? shopId;

  @override
  String get path {
    var p = r'/sale/admin/shops/check-name';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'tenantId', value: tenantId),
    QueryParameter(key: r'name', value: name),
    if (shopId != null) QueryParameter(key: r'shopId', value: shopId),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseAdminShopNameCheckResponseDTO> get defaultResponseFactory => ApiResponseAdminShopNameCheckResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseAdminShopNameCheckResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
