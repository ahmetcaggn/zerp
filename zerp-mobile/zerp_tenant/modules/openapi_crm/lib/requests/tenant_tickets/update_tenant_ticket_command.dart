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
import '../../model/update_ticket_request.dart';


/// Request schema for [UpdateTenantTicketCommand].
class UpdateTenantTicketRequestSchema extends JsonRequestSchema {
  const UpdateTenantTicketRequestSchema({required this.data});

  final UpdateTicketRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /crm/tickets/{id}
class UpdateTenantTicketCommand extends OpenapiDefinitionBaseRequest<ApiResponseTicketResponse> {
  UpdateTenantTicketCommand({
    required this.id,
    required UpdateTicketRequest updateTicketRequest,
  }) : _payload = UpdateTenantTicketRequestSchema(data: updateTicketRequest);

  /// Unique identifier of the entity to update
  final String id;

  final UpdateTenantTicketRequestSchema _payload;

  @override
  String get path {
    var p = r'/crm/tickets/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

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
