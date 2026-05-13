//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'product_recipe_item_dto.dart';


part 'product_recipe_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductRecipeDTO extends Schema {
  /// Returns a new [ProductRecipeDTO] instance.
  ProductRecipeDTO({
    this.id,
    this.productId,
    this.productName,
    this.name,
    this.description,
    this.items = const [],
    this.tenantId,
    this.default_,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'productId')
  final String? productId;

  @JsonKey(name: r'productName')
  final String? productName;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'items')
  final List<ProductRecipeItemDTO> items;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  @JsonKey(name: r'default')
  final bool? default_;

  /// The factory instance for creating [ProductRecipeDTO] from JSON.
  static const factory = ProductRecipeDTOFactory();

  factory ProductRecipeDTO.fromJson(Map<String, dynamic> json) => _$ProductRecipeDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductRecipeDTOToJson(this);

  static List<ProductRecipeDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductRecipeDTOFactory extends JsonSchemaFactory<ProductRecipeDTO> {
  const ProductRecipeDTOFactory();

  @override
  ProductRecipeDTO fromJson(dynamic json) => ProductRecipeDTO.fromJson(json as Map<String, dynamic>);
}




