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


///
/// DELETE /crm/teams/{id}/members/{userId}
class RemoveTeamMemberCommand extends OpenapiDefinitionBaseRequest<TeamResponse> {
  RemoveTeamMemberCommand({
    required this.id,
    required this.userId,
  });

  final String id;
  final String userId;

  @override
  String get path {
    var p = r'/crm/teams/{id}/members/{userId}';
    p = p.replaceAll('{id}', id);
    p = p.replaceAll('{userId}', userId);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.delete;

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
      const EmptyRequestSchema();
}
