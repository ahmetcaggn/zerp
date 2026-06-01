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
import '../../model/permission_group_create_request_dto.dart';


/// Request schema for [CreateCustomGroupCommand].
class CreateCustomGroupRequestSchema extends JsonRequestSchema {
  const CreateCustomGroupRequestSchema({required this.data});

  final PermissionGroupCreateRequestDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /user/permission-groups
class CreateCustomGroupCommand extends OpenapiDefinitionBaseRequest<ApiResponsePermissionGroupResponseDTO> {
  CreateCustomGroupCommand({
    required PermissionGroupCreateRequestDTO permissionGroupCreateRequestDTO,
  }) : _payload = CreateCustomGroupRequestSchema(data: permissionGroupCreateRequestDTO);


  final CreateCustomGroupRequestSchema _payload;

  @override
  String get path {
    var p = r'/user/permission-groups';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

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
