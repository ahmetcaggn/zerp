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
import '../../model/admin_create_employee_request_dto.dart';


/// Request schema for [CreateForTenantCommand].
class CreateForTenantRequestSchema extends JsonRequestSchema {
  const CreateForTenantRequestSchema({required this.data});

  final AdminCreateEmployeeRequestDto data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

///
/// POST /employee/admin
class CreateForTenantCommand extends OpenapiDefinitionBaseRequest<ApiResponseEmployeeResponseDto> {
  CreateForTenantCommand({
    required AdminCreateEmployeeRequestDto adminCreateEmployeeRequestDto,
  }) : _payload = CreateForTenantRequestSchema(data: adminCreateEmployeeRequestDto);


  final CreateForTenantRequestSchema _payload;

  @override
  String get path {
    var p = r'/employee/admin';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

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
