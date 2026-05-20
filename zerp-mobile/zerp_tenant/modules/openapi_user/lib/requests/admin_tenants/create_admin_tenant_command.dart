//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_tenant_response_dto.dart';
import '../../model/tenant_create_request_dto.dart';


/// Request schema for [CreateAdminTenantCommand].
class CreateAdminTenantRequestSchema extends JsonRequestSchema {
  const CreateAdminTenantRequestSchema({required this.data});

  final TenantCreateRequestDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /user/tenants
class CreateAdminTenantCommand extends OpenapiDefinitionBaseRequest<ApiResponseTenantResponseDTO> {
  CreateAdminTenantCommand({
    required TenantCreateRequestDTO tenantCreateRequestDTO,
  }) : _payload = CreateAdminTenantRequestSchema(data: tenantCreateRequestDTO);


  final CreateAdminTenantRequestSchema _payload;

  @override
  String get path {
    var p = r'/user/tenants';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponseTenantResponseDTO> get defaultResponseFactory => ApiResponseTenantResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseTenantResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
