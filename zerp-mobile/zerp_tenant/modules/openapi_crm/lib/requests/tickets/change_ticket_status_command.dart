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
import '../../model/change_status_request.dart';


/// Request schema for [ChangeTicketStatusCommand].
class ChangeTicketStatusRequestSchema extends JsonRequestSchema {
  const ChangeTicketStatusRequestSchema({required this.data});

  final ChangeStatusRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// PATCH /api/tickets/{id}/status
class ChangeTicketStatusCommand extends OpenapiDefinitionBaseRequest<TicketResponse> {
  ChangeTicketStatusCommand({
    required this.id,
    required ChangeStatusRequest changeStatusRequest,
  }) : _payload = ChangeTicketStatusRequestSchema(data: changeStatusRequest);

  final int id;

  final ChangeTicketStatusRequestSchema _payload;

  @override
  String get path {
    var p = r'/api/tickets/{id}/status';
    p = p.replaceAll('{id}', id.toString());
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
