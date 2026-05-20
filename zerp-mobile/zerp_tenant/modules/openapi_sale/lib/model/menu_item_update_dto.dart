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


part 'menu_item_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuItemUpdateDTO extends Schema {
  /// Returns a new [MenuItemUpdateDTO] instance.
  MenuItemUpdateDTO({
    this.name,
    this.description,
    this.price,
    this.categoryId,
    this.imageId,
    this.calories,
    this.weight,
    this.ingredients = const [],
    this.allergens = const [],
    this.productItems = const [],
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'price')
  final num? price;

  @JsonKey(name: r'categoryId')
  final String? categoryId;

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

  @JsonKey(name: r'productItems')
  final List<MenuItemProductItemDTO> productItems;

  /// The factory instance for creating [MenuItemUpdateDTO] from JSON.
  static const factory = MenuItemUpdateDTOFactory();

  factory MenuItemUpdateDTO.fromJson(Map<String, dynamic> json) => _$MenuItemUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuItemUpdateDTOToJson(this);

  static List<MenuItemUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuItemUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuItemUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuItemUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, MenuItemUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuItemUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuItemUpdateDTOFactory extends JsonSchemaFactory<MenuItemUpdateDTO> {
  const MenuItemUpdateDTOFactory();

  @override
  MenuItemUpdateDTO fromJson(dynamic json) => MenuItemUpdateDTO.fromJson(json as Map<String, dynamic>);
}




