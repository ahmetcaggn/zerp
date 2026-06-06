//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/email_employee_list_request_dto.dart';


/// Request schema for [SendEmailCommand].
class SendEmailRequestSchema extends JsonRequestSchema {
  const SendEmailRequestSchema({required this.data});

  final EmailEmployeeListRequestDto data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /notification/email/send
class SendEmailCommand extends OpenapiDefinitionBaseRequest<EmailEmployeeListRequestDto> {
  SendEmailCommand({
    required EmailEmployeeListRequestDto emailEmployeeListRequestDto,
  }) : _payload = SendEmailRequestSchema(data: emailEmployeeListRequestDto);


  final SendEmailRequestSchema _payload;

  @override
  String get path {
    var p = r'/notification/email/send';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<EmailEmployeeListRequestDto> get defaultResponseFactory => EmailEmployeeListRequestDto.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: EmailEmployeeListRequestDto.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
