//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_team_response.dart';
import '../../model/create_team_request.dart';


/// Request schema for [CreateTeamCommand].
class CreateTeamRequestSchema extends JsonRequestSchema {
  const CreateTeamRequestSchema({required this.data});

  final CreateTeamRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /api/teams
class CreateTeamCommand extends OpenapiDefinitionBaseRequest<ApiResponseTeamResponse> {
  CreateTeamCommand({
    required CreateTeamRequest createTeamRequest,
  }) : _payload = CreateTeamRequestSchema(data: createTeamRequest);


  final CreateTeamRequestSchema _payload;

  @override
  String get path {
    var p = r'/api/teams';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponseTeamResponse> get defaultResponseFactory => ApiResponseTeamResponse.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseTeamResponse.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
