//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_page_employee_list_response_dto.dart';
import '../../model/pageable.dart';


///
/// GET /employee/deleted/paginated
class GetDeletedEmployeesPaginatedCommand extends OpenapiDefinitionBaseRequest<ApiResponsePageEmployeeListResponseDto> {
  GetDeletedEmployeesPaginatedCommand({
    required this.pageable,
  });

  final Pageable pageable;

  @override
  String get path {
    var p = r'/employee/deleted/paginated';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'pageable', value: pageable),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponsePageEmployeeListResponseDto> get defaultResponseFactory => ApiResponsePageEmployeeListResponseDto.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponsePageEmployeeListResponseDto.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
