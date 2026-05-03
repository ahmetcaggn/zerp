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
import '../../model/change_priority_request.dart';


/// Request schema for [ChangeTicketPriorityCommand].
class ChangeTicketPriorityRequestSchema extends JsonRequestSchema {
  const ChangeTicketPriorityRequestSchema({required this.data});

  final ChangePriorityRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// PATCH /crm/tickets/{id}/priority
class ChangeTicketPriorityCommand extends OpenapiDefinitionBaseRequest<TicketResponse> {
  ChangeTicketPriorityCommand({
    required this.id,
    required ChangePriorityRequest changePriorityRequest,
  }) : _payload = ChangeTicketPriorityRequestSchema(data: changePriorityRequest);

  final String id;

  final ChangeTicketPriorityRequestSchema _payload;

  @override
  String get path {
    var p = r'/crm/tickets/{id}/priority';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.patch;

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
