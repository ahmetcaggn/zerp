//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_user_check_response_dto.dart';
import '../../model/user_create_if_not_exist_request_dto.dart';


/// Request schema for [CheckUserExistsCommand].
class CheckUserExistsRequestSchema extends JsonRequestSchema {
  const CheckUserExistsRequestSchema({required this.data});

  final UserCreateIfNotExistRequestDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /feign/users
class CheckUserExistsCommand extends OpenapiDefinitionBaseRequest<ApiResponseUserCheckResponseDTO> {
  CheckUserExistsCommand({
    required UserCreateIfNotExistRequestDTO userCreateIfNotExistRequestDTO,
  }) : _payload = CheckUserExistsRequestSchema(data: userCreateIfNotExistRequestDTO);


  final CheckUserExistsRequestSchema _payload;

  @override
  String get path {
    var p = r'/feign/users';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponseUserCheckResponseDTO> get defaultResponseFactory => ApiResponseUserCheckResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseUserCheckResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
