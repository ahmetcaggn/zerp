//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'menu_item_product_item_dto.dart';


part 'menu_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuItemDTO extends Schema {
  /// Returns a new [MenuItemDTO] instance.
  MenuItemDTO({
    this.id,
    this.name,
    this.description,
    this.price,
    this.imageId,
    this.calories,
    this.weight,
    this.ingredients = const [],
    this.allergens = const [],
    this.categoryId,
    this.categoryName,
    this.productItems = const [],
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'price')
  final num? price;

  @JsonKey(name: r'imageId')
  final String? imageId;

  @JsonKey(name: r'calories')
  final int? calories;

  @JsonKey(name: r'weight')
  final String? weight;

  @JsonKey(name: r'ingredients')
  final List<String> ingredients;

  @JsonKey(name: r'allergens')
  final List<String> allergens;

  @JsonKey(name: r'categoryId')
  final String? categoryId;

  @JsonKey(name: r'categoryName')
  final String? categoryName;

  @JsonKey(name: r'productItems')
  final List<MenuItemProductItemDTO> productItems;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [MenuItemDTO] from JSON.
  static const factory = MenuItemDTOFactory();

  factory MenuItemDTO.fromJson(Map<String, dynamic> json) => _$MenuItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuItemDTOToJson(this);

  static List<MenuItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuItemDTO> mapFromJson(dynamic json) {
    final map = <String, MenuItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuItemDTOFactory extends JsonSchemaFactory<MenuItemDTO> {
  const MenuItemDTOFactory();

  @override
  MenuItemDTO fromJson(dynamic json) => MenuItemDTO.fromJson(json as Map<String, dynamic>);
}




