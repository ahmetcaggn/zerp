//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'tenant_dashboard_trend_point_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TenantDashboardTrendPointDTO extends Schema {
  /// Returns a new [TenantDashboardTrendPointDTO] instance.
  TenantDashboardTrendPointDTO({
    this.label,
    this.sales,
    this.orders,
  });

  @JsonKey(name: r'label')
  final String? label;

  @JsonKey(name: r'sales')
  final num? sales;

  @JsonKey(name: r'orders')
  final int? orders;

  /// The factory instance for creating [TenantDashboardTrendPointDTO] from JSON.
  static const factory = TenantDashboardTrendPointDTOFactory();

  factory TenantDashboardTrendPointDTO.fromJson(Map<String, dynamic> json) => _$TenantDashboardTrendPointDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TenantDashboardTrendPointDTOToJson(this);

  static List<TenantDashboardTrendPointDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TenantDashboardTrendPointDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TenantDashboardTrendPointDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TenantDashboardTrendPointDTO> mapFromJson(dynamic json) {
    final map = <String, TenantDashboardTrendPointDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TenantDashboardTrendPointDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TenantDashboardTrendPointDTOFactory extends JsonSchemaFactory<TenantDashboardTrendPointDTO> {
  const TenantDashboardTrendPointDTOFactory();

  @override
  TenantDashboardTrendPointDTO fromJson(dynamic json) => TenantDashboardTrendPointDTO.fromJson(json as Map<String, dynamic>);
}




