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


/// Request schema for [CreateUserCommand].
class CreateUserRequestSchema extends JsonRequestSchema {
  const CreateUserRequestSchema({required this.data});

  final Object data;

  @override
  dynamic toJsonPayload() => data;
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /user
class CreateUserCommand extends OpenapiDefinitionBaseRequest<ApiResponseUserResponseDTO> {
  CreateUserCommand({
    required Object body,
  }) : _payload = CreateUserRequestSchema(data: body);


  final CreateUserRequestSchema _payload;

  @override
  String get path {
    var p = r'/user';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

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
      _payload;
}
