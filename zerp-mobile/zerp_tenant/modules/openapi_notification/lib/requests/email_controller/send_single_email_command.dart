//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/email_single_request_dto.dart';


/// Request schema for [SendSingleEmailCommand].
class SendSingleEmailRequestSchema extends JsonRequestSchema {
  const SendSingleEmailRequestSchema({required this.data});

  final EmailSingleRequestDto data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /notification/email/sendSingle
class SendSingleEmailCommand extends OpenapiDefinitionBaseRequest<AnyDataSchema> {
  SendSingleEmailCommand({
    required EmailSingleRequestDto emailSingleRequestDto,
  }) : _payload = SendSingleEmailRequestSchema(data: emailSingleRequestDto);


  final SendSingleEmailRequestSchema _payload;

  @override
  String get path {
    var p = r'/notification/email/sendSingle';
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
