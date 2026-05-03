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
import '../../model/change_member_role_request.dart';


/// Request schema for [ChangeTeamMemberRoleCommand].
class ChangeTeamMemberRoleRequestSchema extends JsonRequestSchema {
  const ChangeTeamMemberRoleRequestSchema({required this.data});

  final ChangeMemberRoleRequest data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// PATCH /crm/teams/{id}/members/{userId}/role
class ChangeTeamMemberRoleCommand extends OpenapiDefinitionBaseRequest<TeamResponse> {
  ChangeTeamMemberRoleCommand({
    required this.id,
    required this.userId,
    required ChangeMemberRoleRequest changeMemberRoleRequest,
  }) : _payload = ChangeTeamMemberRoleRequestSchema(data: changeMemberRoleRequest);

  final String id;
  final String userId;

  final ChangeTeamMemberRoleRequestSchema _payload;

  @override
  String get path {
    var p = r'/crm/teams/{id}/members/{userId}/role';
    p = p.replaceAll('{id}', id);
    p = p.replaceAll('{userId}', userId);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.patch;

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
