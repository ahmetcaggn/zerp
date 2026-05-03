//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_ticket_response.dart';
import '../../model/create_ticket_request.dart';


/// Request schema for [CreateTenantTicketCommand].
class CreateTenantTicketRequestSchema extends JsonRequestSchema {
  const CreateTenantTicketRequestSchema({required this.data});

  final CreateTicketRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /crm/tickets
class CreateTenantTicketCommand extends OpenapiDefinitionBaseRequest<ApiResponseTicketResponse> {
  CreateTenantTicketCommand({
    required CreateTicketRequest createTicketRequest,
  }) : _payload = CreateTenantTicketRequestSchema(data: createTicketRequest);


  final CreateTenantTicketRequestSchema _payload;

  @override
  String get path {
    var p = r'/crm/tickets';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponseTicketResponse> get defaultResponseFactory => ApiResponseTicketResponse.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseTicketResponse.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
