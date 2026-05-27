//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_dashboard_top_product_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopDashboardTopProductDTO extends Schema {
  /// Returns a new [ShopDashboardTopProductDTO] instance.
  ShopDashboardTopProductDTO({
    this.menuItemId,
    this.menuItemName,
    this.soldCount,
    this.revenue,
  });

  @JsonKey(name: r'menuItemId')
  final String? menuItemId;

  @JsonKey(name: r'menuItemName')
  final String? menuItemName;

  @JsonKey(name: r'soldCount')
  final int? soldCount;

  @JsonKey(name: r'revenue')
  final num? revenue;

  /// The factory instance for creating [ShopDashboardTopProductDTO] from JSON.
  static const factory = ShopDashboardTopProductDTOFactory();

  factory ShopDashboardTopProductDTO.fromJson(Map<String, dynamic> json) => _$ShopDashboardTopProductDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopDashboardTopProductDTOToJson(this);

  static List<ShopDashboardTopProductDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopDashboardTopProductDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopDashboardTopProductDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopDashboardTopProductDTO> mapFromJson(dynamic json) {
    final map = <String, ShopDashboardTopProductDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopDashboardTopProductDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopDashboardTopProductDTOFactory extends JsonSchemaFactory<ShopDashboardTopProductDTO> {
  const ShopDashboardTopProductDTOFactory();

  @override
  ShopDashboardTopProductDTO fromJson(dynamic json) => ShopDashboardTopProductDTO.fromJson(json as Map<String, dynamic>);
}




