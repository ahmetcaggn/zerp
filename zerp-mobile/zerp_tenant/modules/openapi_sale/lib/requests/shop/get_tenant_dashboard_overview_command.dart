//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/tenant_dashboard_overview_dto.dart';


///
/// GET /sale/shops/dashboard-overview
class GetTenantDashboardOverviewCommand extends OpenapiDefinitionBaseRequest<TenantDashboardOverviewDTO> {
  GetTenantDashboardOverviewCommand();


  @override
  String get path {
    var p = r'/sale/shops/dashboard-overview';
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<TenantDashboardOverviewDTO> get defaultResponseFactory => TenantDashboardOverviewDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: TenantDashboardOverviewDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
