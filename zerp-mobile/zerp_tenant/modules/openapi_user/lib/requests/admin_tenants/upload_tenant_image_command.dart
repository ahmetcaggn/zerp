//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_tenant_image_upload_response_dto.dart';


/// Request schema for [UploadTenantImageCommand] (multipart).
class UploadTenantImageRequestSchema extends FormDataRequestSchema {
  const UploadTenantImageRequestSchema({
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
/// POST /user/tenants/{id}/image
class UploadTenantImageCommand extends OpenapiDefinitionBaseRequest<ApiResponseTenantImageUploadResponseDTO> {
  UploadTenantImageCommand({
    required this.id,
    required MultipartFileSchema file,
  }) : _payload = UploadTenantImageRequestSchema(
          file: file,
        );

  final String id;

  final UploadTenantImageRequestSchema _payload;

  @override
  String get path {
    var p = r'/user/tenants/{id}/image';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponseTenantImageUploadResponseDTO> get defaultResponseFactory => ApiResponseTenantImageUploadResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseTenantImageUploadResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
