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


/// Request schema for [CreateCommand].
class CreateRequestSchema extends JsonRequestSchema {
  const CreateRequestSchema({required this.data});

  final CreateAnnouncementRequestDto data;

  @override
  dynamic toJsonPayload() => data.toJson();
}

/// Create: Create a new entity
/// Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 
///
/// POST /notification/announcements
class CreateCommand extends OpenapiDefinitionBaseRequest<ApiResponseAnnouncementResponseDto> {
  CreateCommand({
    required CreateAnnouncementRequestDto createAnnouncementRequestDto,
  }) : _payload = CreateRequestSchema(data: createAnnouncementRequestDto);


  final CreateRequestSchema _payload;

  @override
  String get path {
    var p = r'/notification/announcements';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.post;

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
