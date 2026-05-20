//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_tenant_name_check_response_dto.dart';


///
/// GET /user/tenants/check-name
class CheckTenantNameCommand extends OpenapiDefinitionBaseRequest<ApiResponseTenantNameCheckResponseDTO> {
  CheckTenantNameCommand({
    required this.name,
  });

  final String name;

  @override
  String get path {
    var p = r'/user/tenants/check-name';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'name', value: name),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseTenantNameCheckResponseDTO> get defaultResponseFactory => ApiResponseTenantNameCheckResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseTenantNameCheckResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
