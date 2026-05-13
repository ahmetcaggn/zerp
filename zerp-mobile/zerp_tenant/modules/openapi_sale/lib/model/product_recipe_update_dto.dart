//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'product_recipe_item_create_dto.dart';


part 'product_recipe_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductRecipeUpdateDTO extends Schema {
  /// Returns a new [ProductRecipeUpdateDTO] instance.
  ProductRecipeUpdateDTO({
    this.name,
    this.isDefault,
    this.description,
    this.items = const [],
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'isDefault')
  final bool? isDefault;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'items')
  final List<ProductRecipeItemCreateDTO> items;

  /// The factory instance for creating [ProductRecipeUpdateDTO] from JSON.
  static const factory = ProductRecipeUpdateDTOFactory();

  factory ProductRecipeUpdateDTO.fromJson(Map<String, dynamic> json) => _$ProductRecipeUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductRecipeUpdateDTOToJson(this);

  static List<ProductRecipeUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductRecipeUpdateDTOFactory extends JsonSchemaFactory<ProductRecipeUpdateDTO> {
  const ProductRecipeUpdateDTOFactory();

  @override
  ProductRecipeUpdateDTO fromJson(dynamic json) => ProductRecipeUpdateDTO.fromJson(json as Map<String, dynamic>);
}




