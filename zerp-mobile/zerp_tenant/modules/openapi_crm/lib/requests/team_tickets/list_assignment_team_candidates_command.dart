//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_assignment_team_candidate_response.dart';


///
/// GET /crm/tickets/{id}/assignment-candidates/teams
class ListAssignmentTeamCandidatesCommand extends OpenapiDefinitionBaseRequest<ApiResponseListAssignmentTeamCandidateResponse> {
  ListAssignmentTeamCandidatesCommand({
    required this.id,
    this.start,
    this.end,
    this.sort,
    this.order,
    this.query,
  });

  final String id;
  final int? start;
  final int? end;
  final String? sort;
  final String? order;
  final String? query;

  @override
  String get path {
    var p = r'/crm/tickets/{id}/assignment-candidates/teams';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    if (start != null) QueryParameter(key: r'_start', value: start),
    if (end != null) QueryParameter(key: r'_end', value: end),
    if (sort != null) QueryParameter(key: r'_sort', value: sort),
    if (order != null) QueryParameter(key: r'_order', value: order),
    if (query != null) QueryParameter(key: r'query', value: query),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseListAssignmentTeamCandidateResponse> get defaultResponseFactory => ApiResponseListAssignmentTeamCandidateResponse.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListAssignmentTeamCandidateResponse.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
