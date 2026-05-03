//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_long.dart';


/// Request schema for [PatchManyPermissionsCommand].
class PatchManyPermissionsRequestSchema extends JsonRequestSchema {
  const PatchManyPermissionsRequestSchema({required this.data});

  final Map<String, Object> data;

  @override
  dynamic toJsonPayload() => data;
}

/// UpdateMany: Update multiple entities
/// Updates multiple entities with the same field values in a single operation. Implements ra-spring-data-provider's updateMany operation for bulk updates. Returns a list of updated entity IDs. 
///
/// PATCH /user/permissions
class PatchManyPermissionsCommand extends OpenapiDefinitionBaseRequest<ApiResponseListLong> {
  PatchManyPermissionsCommand({
    this.id,
    required Map<String, Object> requestBody,
  }) : _payload = PatchManyPermissionsRequestSchema(data: requestBody);

  /// List of entity IDs to update
  final List<int>? id;

  final PatchManyPermissionsRequestSchema _payload;

  @override
  String get path {
    var p = r'/user/permissions';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    if (id != null) QueryParameter(key: r'id', value: id),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.patch;

  @override
  SchemaFactory<ApiResponseListLong> get defaultResponseFactory => ApiResponseListLong.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListLong.factory,
  };

  @override
  RequestSchema get payload =>
      _payload;
}
