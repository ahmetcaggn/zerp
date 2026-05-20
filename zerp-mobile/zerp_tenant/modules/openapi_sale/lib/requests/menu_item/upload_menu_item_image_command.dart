//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/menu_item_image_upload_response_dto.dart';


/// Request schema for [UploadMenuItemImageCommand] (multipart).
class UploadMenuItemImageRequestSchema extends FormDataRequestSchema {
  const UploadMenuItemImageRequestSchema({
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
/// POST /sale/menu-items/images
class UploadMenuItemImageCommand extends OpenapiDefinitionBaseRequest<MenuItemImageUploadResponseDTO> {
  UploadMenuItemImageCommand({
    required this.categoryId,
    required MultipartFileSchema file,
  }) : _payload = UploadMenuItemImageRequestSchema(
          file: file,
        );

  final String categoryId;

  final UploadMenuItemImageRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/menu-items/images';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'categoryId', value: categoryId),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<MenuItemImageUploadResponseDTO> get defaultResponseFactory => MenuItemImageUploadResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: MenuItemImageUploadResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
