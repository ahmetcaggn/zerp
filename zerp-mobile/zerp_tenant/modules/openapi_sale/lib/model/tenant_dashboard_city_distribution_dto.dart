//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'tenant_dashboard_city_distribution_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TenantDashboardCityDistributionDTO extends Schema {
  /// Returns a new [TenantDashboardCityDistributionDTO] instance.
  TenantDashboardCityDistributionDTO({
    this.city,
    this.storeCount,
    this.percentage,
  });

  @JsonKey(name: r'city')
  final String? city;

  @JsonKey(name: r'storeCount')
  final int? storeCount;

  @JsonKey(name: r'percentage')
  final num? percentage;

  /// The factory instance for creating [TenantDashboardCityDistributionDTO] from JSON.
  static const factory = TenantDashboardCityDistributionDTOFactory();

  factory TenantDashboardCityDistributionDTO.fromJson(Map<String, dynamic> json) => _$TenantDashboardCityDistributionDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TenantDashboardCityDistributionDTOToJson(this);

  static List<TenantDashboardCityDistributionDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TenantDashboardCityDistributionDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TenantDashboardCityDistributionDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TenantDashboardCityDistributionDTO> mapFromJson(dynamic json) {
    final map = <String, TenantDashboardCityDistributionDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TenantDashboardCityDistributionDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TenantDashboardCityDistributionDTOFactory extends JsonSchemaFactory<TenantDashboardCityDistributionDTO> {
  const TenantDashboardCityDistributionDTOFactory();

  @override
  TenantDashboardCityDistributionDTO fromJson(dynamic json) => TenantDashboardCityDistributionDTO.fromJson(json as Map<String, dynamic>);
}




