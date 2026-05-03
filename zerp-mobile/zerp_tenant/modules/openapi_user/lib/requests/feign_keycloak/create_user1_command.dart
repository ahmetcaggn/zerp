//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_keycloak_create_user_response_dto.dart';
import '../../model/keycloak_create_user_request_dto.dart';


/// Request schema for [CreateUser1Command].
class CreateUser1RequestSchema extends JsonRequestSchema {
  const CreateUser1RequestSchema({required this.data});

  final KeycloakCreateUserRequestDTO data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /feign/keycloak/users
class CreateUser1Command extends OpenapiDefinitionBaseRequest<ApiResponseKeycloakCreateUserResponseDTO> {
  CreateUser1Command({
    required KeycloakCreateUserRequestDTO keycloakCreateUserRequestDTO,
  }) : _payload = CreateUser1RequestSchema(data: keycloakCreateUserRequestDTO);


  final CreateUser1RequestSchema _payload;

  @override
  String get path {
    var p = r'/feign/keycloak/users';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

  @override
  SchemaFactory<ApiResponseKeycloakCreateUserResponseDTO> get defaultResponseFactory => ApiResponseKeycloakCreateUserResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseKeycloakCreateUserResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
