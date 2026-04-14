//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_employee_response_dto.dart';
import '../../model/update_employee_request_dto.dart';


/// Request schema for [UpdateEmployeeCommand].
class UpdateEmployeeRequestSchema extends JsonRequestSchema {
  const UpdateEmployeeRequestSchema({required this.data});

  final UpdateEmployeeRequestDto data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /employee/{id}
class UpdateEmployeeCommand extends OpenapiDefinitionBaseRequest<ApiResponseEmployeeResponseDto> {
  UpdateEmployeeCommand({
    required this.id,
    required UpdateEmployeeRequestDto updateEmployeeRequestDto,
  }) : _payload = UpdateEmployeeRequestSchema(data: updateEmployeeRequestDto);

  /// Unique identifier of the entity to update
  final int id;

  final UpdateEmployeeRequestSchema _payload;

  @override
  String get path {
    var p = r'/employee/{id}';
    p = p.replaceAll('{id}', id.toString());
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

  @override
  SchemaFactory<ApiResponseEmployeeResponseDto> get defaultResponseFactory => ApiResponseEmployeeResponseDto.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseEmployeeResponseDto.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
