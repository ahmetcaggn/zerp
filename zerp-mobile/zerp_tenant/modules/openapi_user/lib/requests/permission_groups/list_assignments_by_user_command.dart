//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_permission_group_assignment_response_dto.dart';


///
/// GET /user/permission-groups/assignments
class ListAssignmentsByUserCommand extends OpenapiDefinitionBaseRequest<ApiResponseListPermissionGroupAssignmentResponseDTO> {
  ListAssignmentsByUserCommand({
    required this.userId,
  });

  final String userId;

  @override
  String get path {
    var p = r'/user/permission-groups/assignments';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'userId', value: userId),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseListPermissionGroupAssignmentResponseDTO> get defaultResponseFactory => ApiResponseListPermissionGroupAssignmentResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListPermissionGroupAssignmentResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
