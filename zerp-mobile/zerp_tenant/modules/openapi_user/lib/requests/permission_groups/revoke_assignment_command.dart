//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_permission_group_assignment_revoke_response_dto.dart';


///
/// DELETE /user/permission-groups/assignments/{assignmentId}
class RevokeAssignmentCommand extends OpenapiDefinitionBaseRequest<ApiResponsePermissionGroupAssignmentRevokeResponseDTO> {
  RevokeAssignmentCommand({
    required this.assignmentId,
  });

  final String assignmentId;

  @override
  String get path {
    var p = r'/user/permission-groups/assignments/{assignmentId}';
    p = p.replaceAll('{assignmentId}', assignmentId);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.delete;

  @override
  SchemaFactory<ApiResponsePermissionGroupAssignmentRevokeResponseDTO> get defaultResponseFactory => ApiResponsePermissionGroupAssignmentRevokeResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponsePermissionGroupAssignmentRevokeResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
