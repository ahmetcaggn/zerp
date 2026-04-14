//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/email_list_request_dto.dart';


/// Request schema for [SendEmailToListCommand].
class SendEmailToListRequestSchema extends JsonRequestSchema {
  const SendEmailToListRequestSchema({required this.data});

  final EmailListRequestDto data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /notification/email/sendToList
class SendEmailToListCommand extends OpenapiDefinitionBaseRequest<AnyDataSchema> {
  SendEmailToListCommand({
    required EmailListRequestDto emailListRequestDto,
  }) : _payload = SendEmailToListRequestSchema(data: emailListRequestDto);


  final SendEmailToListRequestSchema _payload;

  @override
  String get path {
    var p = r'/notification/email/sendToList';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<AnyDataSchema> get defaultResponseFactory => AnyDataSchema.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: AnyDataSchema.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
