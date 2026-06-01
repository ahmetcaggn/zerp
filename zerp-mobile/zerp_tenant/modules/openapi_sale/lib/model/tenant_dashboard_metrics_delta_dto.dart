//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'tenant_dashboard_metrics_delta_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TenantDashboardMetricsDeltaDTO extends Schema {
  /// Returns a new [TenantDashboardMetricsDeltaDTO] instance.
  TenantDashboardMetricsDeltaDTO({
    this.totalSalesDeltaPercentage,
    this.averageBasketDeltaPercentage,
    this.totalOrdersDeltaPercentage,
  });

  @JsonKey(name: r'totalSalesDeltaPercentage')
  final num? totalSalesDeltaPercentage;

  @JsonKey(name: r'averageBasketDeltaPercentage')
  final num? averageBasketDeltaPercentage;

  @JsonKey(name: r'totalOrdersDeltaPercentage')
  final num? totalOrdersDeltaPercentage;

  /// The factory instance for creating [TenantDashboardMetricsDeltaDTO] from JSON.
  static const factory = TenantDashboardMetricsDeltaDTOFactory();

  factory TenantDashboardMetricsDeltaDTO.fromJson(Map<String, dynamic> json) => _$TenantDashboardMetricsDeltaDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TenantDashboardMetricsDeltaDTOToJson(this);

  static List<TenantDashboardMetricsDeltaDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TenantDashboardMetricsDeltaDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TenantDashboardMetricsDeltaDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TenantDashboardMetricsDeltaDTO> mapFromJson(dynamic json) {
    final map = <String, TenantDashboardMetricsDeltaDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TenantDashboardMetricsDeltaDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TenantDashboardMetricsDeltaDTOFactory extends JsonSchemaFactory<TenantDashboardMetricsDeltaDTO> {
  const TenantDashboardMetricsDeltaDTOFactory();

  @override
  TenantDashboardMetricsDeltaDTO fromJson(dynamic json) => TenantDashboardMetricsDeltaDTO.fromJson(json as Map<String, dynamic>);
}




