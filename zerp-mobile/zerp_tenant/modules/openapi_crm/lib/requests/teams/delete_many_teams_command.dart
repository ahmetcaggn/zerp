//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_integer.dart';


/// DeleteMany: Delete multiple entities
/// Deletes multiple entities in a single operation. Implements ra-spring-data-provider's deleteMany operation for bulk deletions. Returns a list of deleted entity IDs. 
///
/// DELETE /api/teams
class DeleteManyTeamsCommand extends OpenapiDefinitionBaseRequest<ApiResponseListInteger> {
  DeleteManyTeamsCommand({
    this.id,
  });

  /// List of entity IDs to delete
  final List<int>? id;

  @override
  String get path {
    var p = r'/api/teams';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    if (id != null) QueryParameter(key: r'id', value: id),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.delete;

  @override
  SchemaFactory<ApiResponseListInteger> get defaultResponseFactory => ApiResponseListInteger.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListInteger.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
