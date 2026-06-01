//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/shop_image_upload_response_dto.dart';


/// Request schema for [UploadShopImageCommand] (multipart).
class UploadShopImageRequestSchema extends FormDataRequestSchema {
  const UploadShopImageRequestSchema({
    required this.file,
  });

  final MultipartFileSchema file;

  @override
  Map<String, dynamic> toFormDataMapPayload() {
    return {
      r'file': file,
    };
  }
}

///
/// POST /sale/shops/{shopId}/image
class UploadShopImageCommand extends OpenapiDefinitionBaseRequest<ShopImageUploadResponseDTO> {
  UploadShopImageCommand({
    required this.shopId,
    required MultipartFileSchema file,
  }) : _payload = UploadShopImageRequestSchema(
          file: file,
        );

  final String shopId;

  final UploadShopImageRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/shops/{shopId}/image';
    p = p.replaceAll('{shopId}', shopId);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ShopImageUploadResponseDTO> get defaultResponseFactory => ShopImageUploadResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ShopImageUploadResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
