//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_admin_shop_response_dto.dart';
import '../../model/admin_shop_update_request_dto.dart';


/// Request schema for [UpdateAdminShopCommand].
class UpdateAdminShopRequestSchema extends JsonRequestSchema {
  const UpdateAdminShopRequestSchema({required this.data});

  final AdminShopUpdateRequestDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /sale/admin/shops/{id}
class UpdateAdminShopCommand extends OpenapiDefinitionBaseRequest<ApiResponseAdminShopResponseDTO> {
  UpdateAdminShopCommand({
    required this.id,
    required AdminShopUpdateRequestDTO adminShopUpdateRequestDTO,
  }) : _payload = UpdateAdminShopRequestSchema(data: adminShopUpdateRequestDTO);

  /// Unique identifier of the entity to update
  final String id;

  final UpdateAdminShopRequestSchema _payload;

  @override
  String get path {
    var p = r'/sale/admin/shops/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

  @override
  SchemaFactory<ApiResponseAdminShopResponseDTO> get defaultResponseFactory => ApiResponseAdminShopResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseAdminShopResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
