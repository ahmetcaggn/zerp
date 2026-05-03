//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/team_response.dart';
import '../../model/add_member_request.dart';


/// Request schema for [AddTeamMemberCommand].
class AddTeamMemberRequestSchema extends JsonRequestSchema {
  const AddTeamMemberRequestSchema({required this.data});

  final AddMemberRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /crm/teams/{id}/members
class AddTeamMemberCommand extends OpenapiDefinitionBaseRequest<TeamResponse> {
  AddTeamMemberCommand({
    required this.id,
    required AddMemberRequest addMemberRequest,
  }) : _payload = AddTeamMemberRequestSchema(data: addMemberRequest);

  final String id;

  final AddTeamMemberRequestSchema _payload;

  @override
  String get path {
    var p = r'/crm/teams/{id}/members';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<TeamResponse> get defaultResponseFactory => TeamResponse.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: TeamResponse.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
