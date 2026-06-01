//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'tenant_dashboard_city_distribution_dto.dart';
import 'tenant_dashboard_metrics_delta_dto.dart';
import 'tenant_dashboard_store_performance_dto.dart';
import 'tenant_dashboard_summary_dto.dart';
import 'tenant_dashboard_trend_point_dto.dart';


part 'tenant_dashboard_overview_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TenantDashboardOverviewDTO extends Schema {
  /// Returns a new [TenantDashboardOverviewDTO] instance.
  TenantDashboardOverviewDTO({
    this.totalSales,
    this.averageBasket,
    this.totalOrders,
    this.totalStores,
    this.metricsDelta,
    this.trend = const [],
    this.cityDistribution = const [],
    this.storePerformance = const [],
    this.summary,
    this.lastUpdatedAt,
  });

  @JsonKey(name: r'totalSales')
  final num? totalSales;

  @JsonKey(name: r'averageBasket')
  final num? averageBasket;

  @JsonKey(name: r'totalOrders')
  final int? totalOrders;

  @JsonKey(name: r'totalStores')
  final int? totalStores;

  @JsonKey(name: r'metricsDelta')
  final TenantDashboardMetricsDeltaDTO? metricsDelta;

  @JsonKey(name: r'trend')
  final List<TenantDashboardTrendPointDTO> trend;

  @JsonKey(name: r'cityDistribution')
  final List<TenantDashboardCityDistributionDTO> cityDistribution;

  @JsonKey(name: r'storePerformance')
  final List<TenantDashboardStorePerformanceDTO> storePerformance;

  @JsonKey(name: r'summary')
  final TenantDashboardSummaryDTO? summary;

  @JsonKey(name: r'lastUpdatedAt')
  final DateTime? lastUpdatedAt;

  /// The factory instance for creating [TenantDashboardOverviewDTO] from JSON.
  static const factory = TenantDashboardOverviewDTOFactory();

  factory TenantDashboardOverviewDTO.fromJson(Map<String, dynamic> json) => _$TenantDashboardOverviewDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TenantDashboardOverviewDTOToJson(this);

  static List<TenantDashboardOverviewDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TenantDashboardOverviewDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TenantDashboardOverviewDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TenantDashboardOverviewDTO> mapFromJson(dynamic json) {
    final map = <String, TenantDashboardOverviewDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TenantDashboardOverviewDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TenantDashboardOverviewDTOFactory extends JsonSchemaFactory<TenantDashboardOverviewDTO> {
  const TenantDashboardOverviewDTOFactory();

  @override
  TenantDashboardOverviewDTO fromJson(dynamic json) => TenantDashboardOverviewDTO.fromJson(json as Map<String, dynamic>);
}




