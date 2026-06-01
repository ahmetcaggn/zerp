//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_permission_group_response_dto.dart';


///
/// GET /user/permission-groups/predefined
class GetPredefinedGroupsCommand extends OpenapiDefinitionBaseRequest<ApiResponseListPermissionGroupResponseDTO> {
  GetPredefinedGroupsCommand();


  @override
  String get path {
    var p = r'/user/permission-groups/predefined';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseListPermissionGroupResponseDTO> get defaultResponseFactory => ApiResponseListPermissionGroupResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListPermissionGroupResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
