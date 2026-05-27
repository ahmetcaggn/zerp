//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_dashboard_performance_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopDashboardPerformanceDTO extends Schema {
  /// Returns a new [ShopDashboardPerformanceDTO] instance.
  ShopDashboardPerformanceDTO({
    this.totalRevenue,
    this.totalRevenueDeltaPercentage,
    this.averageCheck,
    this.averageCheckDeltaPercentage,
    this.totalTableServiceCount,
    this.totalTableServiceCountDeltaPercentage,
    this.customerSatisfaction,
  });

  @JsonKey(name: r'totalRevenue')
  final num? totalRevenue;

  @JsonKey(name: r'totalRevenueDeltaPercentage')
  final num? totalRevenueDeltaPercentage;

  @JsonKey(name: r'averageCheck')
  final num? averageCheck;

  @JsonKey(name: r'averageCheckDeltaPercentage')
  final num? averageCheckDeltaPercentage;

  @JsonKey(name: r'totalTableServiceCount')
  final int? totalTableServiceCount;

  @JsonKey(name: r'totalTableServiceCountDeltaPercentage')
  final num? totalTableServiceCountDeltaPercentage;

  @JsonKey(name: r'customerSatisfaction')
  final num? customerSatisfaction;

  /// The factory instance for creating [ShopDashboardPerformanceDTO] from JSON.
  static const factory = ShopDashboardPerformanceDTOFactory();

  factory ShopDashboardPerformanceDTO.fromJson(Map<String, dynamic> json) => _$ShopDashboardPerformanceDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopDashboardPerformanceDTOToJson(this);

  static List<ShopDashboardPerformanceDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopDashboardPerformanceDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopDashboardPerformanceDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopDashboardPerformanceDTO> mapFromJson(dynamic json) {
    final map = <String, ShopDashboardPerformanceDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopDashboardPerformanceDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopDashboardPerformanceDTOFactory extends JsonSchemaFactory<ShopDashboardPerformanceDTO> {
  const ShopDashboardPerformanceDTOFactory();

  @override
  ShopDashboardPerformanceDTO fromJson(dynamic json) => ShopDashboardPerformanceDTO.fromJson(json as Map<String, dynamic>);
}




