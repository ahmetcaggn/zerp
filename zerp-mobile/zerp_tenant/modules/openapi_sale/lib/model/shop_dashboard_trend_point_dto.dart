//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_dashboard_trend_point_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopDashboardTrendPointDTO extends Schema {
  /// Returns a new [ShopDashboardTrendPointDTO] instance.
  ShopDashboardTrendPointDTO({
    this.label,
    this.revenue,
    this.averageCheck,
  });

  @JsonKey(name: r'label')
  final String? label;

  @JsonKey(name: r'revenue')
  final num? revenue;

  @JsonKey(name: r'averageCheck')
  final num? averageCheck;

  /// The factory instance for creating [ShopDashboardTrendPointDTO] from JSON.
  static const factory = ShopDashboardTrendPointDTOFactory();

  factory ShopDashboardTrendPointDTO.fromJson(Map<String, dynamic> json) => _$ShopDashboardTrendPointDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopDashboardTrendPointDTOToJson(this);

  static List<ShopDashboardTrendPointDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopDashboardTrendPointDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopDashboardTrendPointDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopDashboardTrendPointDTO> mapFromJson(dynamic json) {
    final map = <String, ShopDashboardTrendPointDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopDashboardTrendPointDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopDashboardTrendPointDTOFactory extends JsonSchemaFactory<ShopDashboardTrendPointDTO> {
  const ShopDashboardTrendPointDTOFactory();

  @override
  ShopDashboardTrendPointDTO fromJson(dynamic json) => ShopDashboardTrendPointDTO.fromJson(json as Map<String, dynamic>);
}




