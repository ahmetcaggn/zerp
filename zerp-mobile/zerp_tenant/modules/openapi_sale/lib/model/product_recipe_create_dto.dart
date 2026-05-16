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


part 'product_recipe_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductRecipeCreateDTO extends Schema {
  /// Returns a new [ProductRecipeCreateDTO] instance.
  ProductRecipeCreateDTO({
    this.productId,
    this.name,
    this.description,
    this.items = const [],
    this.default_,
  });

  @JsonKey(name: r'productId')
  final String? productId;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'items')
  final List<ProductRecipeItemCreateDTO> items;

  @JsonKey(name: r'default')
  final bool? default_;

  /// The factory instance for creating [ProductRecipeCreateDTO] from JSON.
  static const factory = ProductRecipeCreateDTOFactory();

  factory ProductRecipeCreateDTO.fromJson(Map<String, dynamic> json) => _$ProductRecipeCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductRecipeCreateDTOToJson(this);

  static List<ProductRecipeCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductRecipeCreateDTOFactory extends JsonSchemaFactory<ProductRecipeCreateDTO> {
  const ProductRecipeCreateDTOFactory();

  @override
  ProductRecipeCreateDTO fromJson(dynamic json) => ProductRecipeCreateDTO.fromJson(json as Map<String, dynamic>);
}




