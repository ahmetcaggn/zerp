//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_dashboard_low_stock_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopDashboardLowStockDTO extends Schema {
  /// Returns a new [ShopDashboardLowStockDTO] instance.
  ShopDashboardLowStockDTO({
    this.stockResourceId,
    this.name,
    this.quantity,
    this.reorderThreshold,
    this.unitType,
  });

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'reorderThreshold')
  final num? reorderThreshold;

  @JsonKey(name: r'unitType')
  final String? unitType;

  /// The factory instance for creating [ShopDashboardLowStockDTO] from JSON.
  static const factory = ShopDashboardLowStockDTOFactory();

  factory ShopDashboardLowStockDTO.fromJson(Map<String, dynamic> json) => _$ShopDashboardLowStockDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopDashboardLowStockDTOToJson(this);

  static List<ShopDashboardLowStockDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopDashboardLowStockDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopDashboardLowStockDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopDashboardLowStockDTO> mapFromJson(dynamic json) {
    final map = <String, ShopDashboardLowStockDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopDashboardLowStockDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopDashboardLowStockDTOFactory extends JsonSchemaFactory<ShopDashboardLowStockDTO> {
  const ShopDashboardLowStockDTOFactory();

  @override
  ShopDashboardLowStockDTO fromJson(dynamic json) => ShopDashboardLowStockDTO.fromJson(json as Map<String, dynamic>);
}




