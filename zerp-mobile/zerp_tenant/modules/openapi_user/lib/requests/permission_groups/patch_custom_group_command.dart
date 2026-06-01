//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_permission_group_response_dto.dart';
import '../../model/permission_group_patch_request_dto.dart';


/// Request schema for [PatchCustomGroupCommand].
class PatchCustomGroupRequestSchema extends JsonRequestSchema {
  const PatchCustomGroupRequestSchema({required this.data});

  final PermissionGroupPatchRequestDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// PATCH /user/permission-groups/{id}
class PatchCustomGroupCommand extends OpenapiDefinitionBaseRequest<ApiResponsePermissionGroupResponseDTO> {
  PatchCustomGroupCommand({
    required this.id,
    required PermissionGroupPatchRequestDTO permissionGroupPatchRequestDTO,
  }) : _payload = PatchCustomGroupRequestSchema(data: permissionGroupPatchRequestDTO);

  final String id;

  final PatchCustomGroupRequestSchema _payload;

  @override
  String get path {
    var p = r'/user/permission-groups/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.patch;

  @override
  SchemaFactory<ApiResponsePermissionGroupResponseDTO> get defaultResponseFactory => ApiResponsePermissionGroupResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponsePermissionGroupResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
