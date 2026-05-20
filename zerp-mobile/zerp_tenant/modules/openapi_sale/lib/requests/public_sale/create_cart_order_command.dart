//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_public_cart_order_create_response.dart';
import '../../model/public_cart_order_create_request.dart';


/// Request schema for [CreateCartOrderCommand].
class CreateCartOrderRequestSchema extends JsonRequestSchema {
  const CreateCartOrderRequestSchema({required this.data});

  final PublicCartOrderCreateRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /sale/public/shops/{shopId}/cart-orders
class CreateCartOrderCommand extends OpenapiDefinitionBaseRequest<ApiResponsePublicCartOrderCreateResponse> {
  CreateCartOrderCommand({
    required this.shopId,
    required PublicCartOrderCreateRequest publicCartOrderCreateRequest,
  }) : _payload = CreateCartOrderRequestSchema(data: publicCartOrderCreateRequest);

  final String shopId;

  final CreateCartOrderRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/public/shops/{shopId}/cart-orders';
    p = p.replaceAll('{shopId}', shopId);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponsePublicCartOrderCreateResponse> get defaultResponseFactory => ApiResponsePublicCartOrderCreateResponse.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponsePublicCartOrderCreateResponse.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
