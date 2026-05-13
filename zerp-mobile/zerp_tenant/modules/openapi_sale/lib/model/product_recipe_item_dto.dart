//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'product_recipe_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductRecipeItemDTO extends Schema {
  /// Returns a new [ProductRecipeItemDTO] instance.
  ProductRecipeItemDTO({
    this.id,
    this.stockResourceId,
    this.stockResourceName,
    this.quantity,
    this.unitType,
    this.notes,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'stockResourceName')
  final String? stockResourceName;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'unitType')
  final ProductRecipeItemDTOUnitTypeEnum? unitType;

  @JsonKey(name: r'notes')
  final String? notes;

  /// The factory instance for creating [ProductRecipeItemDTO] from JSON.
  static const factory = ProductRecipeItemDTOFactory();

  factory ProductRecipeItemDTO.fromJson(Map<String, dynamic> json) => _$ProductRecipeItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductRecipeItemDTOToJson(this);

  static List<ProductRecipeItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeItemDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductRecipeItemDTOFactory extends JsonSchemaFactory<ProductRecipeItemDTO> {
  const ProductRecipeItemDTOFactory();

  @override
  ProductRecipeItemDTO fromJson(dynamic json) => ProductRecipeItemDTO.fromJson(json as Map<String, dynamic>);
}



enum ProductRecipeItemDTOUnitTypeEnum {
@JsonValue(r'PIECE')
PIECE(r'PIECE'),
@JsonValue(r'GRAM')
GRAM(r'GRAM'),
@JsonValue(r'KILOGRAM')
KILOGRAM(r'KILOGRAM'),
@JsonValue(r'MILLILITER')
MILLILITER(r'MILLILITER'),
@JsonValue(r'LITER')
LITER(r'LITER');

const ProductRecipeItemDTOUnitTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




