//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'tenant_dashboard_summary_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TenantDashboardSummaryDTO extends Schema {
  /// Returns a new [TenantDashboardSummaryDTO] instance.
  TenantDashboardSummaryDTO({
    this.totalSales,
    this.totalOrders,
    this.averageOrderValue,
    this.topProductName,
    this.topStoreName,
  });

  @JsonKey(name: r'totalSales')
  final num? totalSales;

  @JsonKey(name: r'totalOrders')
  final int? totalOrders;

  @JsonKey(name: r'averageOrderValue')
  final num? averageOrderValue;

  @JsonKey(name: r'topProductName')
  final String? topProductName;

  @JsonKey(name: r'topStoreName')
  final String? topStoreName;

  /// The factory instance for creating [TenantDashboardSummaryDTO] from JSON.
  static const factory = TenantDashboardSummaryDTOFactory();

  factory TenantDashboardSummaryDTO.fromJson(Map<String, dynamic> json) => _$TenantDashboardSummaryDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TenantDashboardSummaryDTOToJson(this);

  static List<TenantDashboardSummaryDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TenantDashboardSummaryDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TenantDashboardSummaryDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TenantDashboardSummaryDTO> mapFromJson(dynamic json) {
    final map = <String, TenantDashboardSummaryDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TenantDashboardSummaryDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TenantDashboardSummaryDTOFactory extends JsonSchemaFactory<TenantDashboardSummaryDTO> {
  const TenantDashboardSummaryDTOFactory();

  @override
  TenantDashboardSummaryDTO fromJson(dynamic json) => TenantDashboardSummaryDTO.fromJson(json as Map<String, dynamic>);
}




