//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_permission_response.dart';
import '../../model/permission_create_request_dto.dart';


/// Request schema for [CreatePermissionCommand].
class CreatePermissionRequestSchema extends JsonRequestSchema {
  const CreatePermissionRequestSchema({required this.data});

  final PermissionCreateRequestDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /user/permissions
class CreatePermissionCommand extends OpenapiDefinitionBaseRequest<ApiResponsePermissionResponse> {
  CreatePermissionCommand({
    required PermissionCreateRequestDTO permissionCreateRequestDTO,
  }) : _payload = CreatePermissionRequestSchema(data: permissionCreateRequestDTO);


  final CreatePermissionRequestSchema _payload;

  @override
  String get path {
    var p = r'/user/permissions';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponsePermissionResponse> get defaultResponseFactory => ApiResponsePermissionResponse.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponsePermissionResponse.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
