//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/attachment_response.dart';


/// Request schema for [UploadTicketAttachmentCommand] (multipart).
class UploadTicketAttachmentRequestSchema extends FormDataRequestSchema {
  const UploadTicketAttachmentRequestSchema({
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
/// POST /crm/tickets/{id}/attachments
class UploadTicketAttachmentCommand extends OpenapiDefinitionBaseRequest<AttachmentResponse> {
  UploadTicketAttachmentCommand({
    required this.id,
    required MultipartFileSchema file,
  }) : _payload = UploadTicketAttachmentRequestSchema(
          file: file,
        );

  final String id;

  final UploadTicketAttachmentRequestSchema _payload;

  @override
  String get path {
    var p = r'/crm/tickets/{id}/attachments';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<AttachmentResponse> get defaultResponseFactory => AttachmentResponse.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: AttachmentResponse.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
