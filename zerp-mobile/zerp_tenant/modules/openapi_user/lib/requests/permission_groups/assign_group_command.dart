//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_permission_group_assign_response_dto.dart';
import '../../model/permission_group_assign_request_dto.dart';


/// Request schema for [AssignGroupCommand].
class AssignGroupRequestSchema extends JsonRequestSchema {
  const AssignGroupRequestSchema({required this.data});

  final PermissionGroupAssignRequestDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /user/permission-groups/assign
class AssignGroupCommand extends OpenapiDefinitionBaseRequest<ApiResponsePermissionGroupAssignResponseDTO> {
  AssignGroupCommand({
    required PermissionGroupAssignRequestDTO permissionGroupAssignRequestDTO,
  }) : _payload = AssignGroupRequestSchema(data: permissionGroupAssignRequestDTO);


  final AssignGroupRequestSchema _payload;

  @override
  String get path {
    var p = r'/user/permission-groups/assign';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponsePermissionGroupAssignResponseDTO> get defaultResponseFactory => ApiResponsePermissionGroupAssignResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponsePermissionGroupAssignResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
