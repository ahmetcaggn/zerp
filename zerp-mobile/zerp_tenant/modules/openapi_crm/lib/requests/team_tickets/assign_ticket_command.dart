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
import '../../model/assign_ticket_request.dart';


/// Request schema for [AssignTicketCommand].
class AssignTicketRequestSchema extends JsonRequestSchema {
  const AssignTicketRequestSchema({required this.data});

  final AssignTicketRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /crm/tickets/{id}/assign
class AssignTicketCommand extends OpenapiDefinitionBaseRequest<TicketResponse> {
  AssignTicketCommand({
    required this.id,
    required AssignTicketRequest assignTicketRequest,
  }) : _payload = AssignTicketRequestSchema(data: assignTicketRequest);

  final String id;

  final AssignTicketRequestSchema _payload;

  @override
  String get path {
    var p = r'/crm/tickets/{id}/assign';
    p = p.replaceAll('{id}', id);
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
