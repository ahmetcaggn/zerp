//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_dashboard_category_sales_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopDashboardCategorySalesDTO extends Schema {
  /// Returns a new [ShopDashboardCategorySalesDTO] instance.
  ShopDashboardCategorySalesDTO({
    this.categoryId,
    this.categoryName,
    this.revenue,
    this.percentage,
  });

  @JsonKey(name: r'categoryId')
  final String? categoryId;

  @JsonKey(name: r'categoryName')
  final String? categoryName;

  @JsonKey(name: r'revenue')
  final num? revenue;

  @JsonKey(name: r'percentage')
  final num? percentage;

  /// The factory instance for creating [ShopDashboardCategorySalesDTO] from JSON.
  static const factory = ShopDashboardCategorySalesDTOFactory();

  factory ShopDashboardCategorySalesDTO.fromJson(Map<String, dynamic> json) => _$ShopDashboardCategorySalesDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopDashboardCategorySalesDTOToJson(this);

  static List<ShopDashboardCategorySalesDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopDashboardCategorySalesDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopDashboardCategorySalesDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopDashboardCategorySalesDTO> mapFromJson(dynamic json) {
    final map = <String, ShopDashboardCategorySalesDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopDashboardCategorySalesDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopDashboardCategorySalesDTOFactory extends JsonSchemaFactory<ShopDashboardCategorySalesDTO> {
  const ShopDashboardCategorySalesDTOFactory();

  @override
  ShopDashboardCategorySalesDTO fromJson(dynamic json) => ShopDashboardCategorySalesDTO.fromJson(json as Map<String, dynamic>);
}




