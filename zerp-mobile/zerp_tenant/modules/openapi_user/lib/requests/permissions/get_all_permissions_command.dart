//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_map_permission_action_list_permission_target_type.dart';


///
/// GET /user/permissions/actions
class GetAllPermissionsCommand extends OpenapiDefinitionBaseRequest<ApiResponseMapPermissionActionListPermissionTargetType> {
  GetAllPermissionsCommand();


  @override
  String get path {
    var p = r'/user/permissions/actions';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseMapPermissionActionListPermissionTargetType> get defaultResponseFactory => ApiResponseMapPermissionActionListPermissionTargetType.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseMapPermissionActionListPermissionTargetType.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
