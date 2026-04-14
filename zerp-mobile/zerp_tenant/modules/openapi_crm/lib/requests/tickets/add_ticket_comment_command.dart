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
import '../../model/add_comment_request.dart';


/// Request schema for [AddTicketCommentCommand].
class AddTicketCommentRequestSchema extends JsonRequestSchema {
  const AddTicketCommentRequestSchema({required this.data});

  final AddCommentRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /api/tickets/{id}/comments
class AddTicketCommentCommand extends OpenapiDefinitionBaseRequest<TicketResponse> {
  AddTicketCommentCommand({
    required this.id,
    required AddCommentRequest addCommentRequest,
  }) : _payload = AddTicketCommentRequestSchema(data: addCommentRequest);

  final int id;

  final AddTicketCommentRequestSchema _payload;

  @override
  String get path {
    var p = r'/api/tickets/{id}/comments';
    p = p.replaceAll('{id}', id.toString());
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
