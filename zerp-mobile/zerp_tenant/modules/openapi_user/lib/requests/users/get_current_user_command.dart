//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_user_response_dto.dart';


/// Get currently authenticated user profile
///
/// GET /user/me
class GetCurrentUserCommand extends OpenapiDefinitionBaseRequest<ApiResponseUserResponseDTO> {
  GetCurrentUserCommand();


  @override
  String get path {
    var p = r'/user/me';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseUserResponseDTO> get defaultResponseFactory => ApiResponseUserResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseUserResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
