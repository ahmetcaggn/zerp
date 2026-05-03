//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_username_check_response_dto.dart';


///
/// GET /user/usernames/check
class CheckUsernameCommand extends OpenapiDefinitionBaseRequest<ApiResponseUsernameCheckResponseDTO> {
  CheckUsernameCommand({
    required this.username,
  });

  final String username;

  @override
  String get path {
    var p = r'/user/usernames/check';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'username', value: username),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseUsernameCheckResponseDTO> get defaultResponseFactory => ApiResponseUsernameCheckResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseUsernameCheckResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
