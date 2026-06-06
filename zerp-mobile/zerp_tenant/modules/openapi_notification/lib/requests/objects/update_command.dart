//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_announcement_response_dto.dart';
import '../../model/create_announcement_request_dto.dart';


/// Request schema for [UpdateCommand].
class UpdateRequestSchema extends JsonRequestSchema {
  const UpdateRequestSchema({required this.data});

  final CreateAnnouncementRequestDto data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Update: Update an existing entity
/// Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 
///
/// PUT /notification/announcements/{id}
class UpdateCommand extends OpenapiDefinitionBaseRequest<ApiResponseAnnouncementResponseDto> {
  UpdateCommand({
    required this.id,
    required CreateAnnouncementRequestDto createAnnouncementRequestDto,
  }) : _payload = UpdateRequestSchema(data: createAnnouncementRequestDto);

  /// Unique identifier of the entity to update
  final String id;

  final UpdateRequestSchema _payload;

  @override
  String get path {
    var p = r'/notification/announcements/{id}';
    p = p.replaceAll('{id}', id);
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.put;

  @override
  SchemaFactory<ApiResponseAnnouncementResponseDto> get defaultResponseFactory => ApiResponseAnnouncementResponseDto.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseAnnouncementResponseDto.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
