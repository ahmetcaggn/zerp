//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/ticket_response.dart';
import '../../model/create_ticket_request.dart';


/// Request schema for [CreateTicketCommand].
class CreateTicketRequestSchema extends JsonRequestSchema {
  const CreateTicketRequestSchema({required this.data});

  final CreateTicketRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /api/tickets
class CreateTicketCommand extends OpenapiDefinitionBaseRequest<TicketResponse> {
  CreateTicketCommand({
    required CreateTicketRequest createTicketRequest,
  }) : _payload = CreateTicketRequestSchema(data: createTicketRequest);


  final CreateTicketRequestSchema _payload;

  @override
  String get path {
    var p = r'/api/tickets';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<TicketResponse> get defaultResponseFactory => TicketResponse.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: TicketResponse.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
