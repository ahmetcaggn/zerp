//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'product_recipe_item_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductRecipeItemCreateDTO extends Schema {
  /// Returns a new [ProductRecipeItemCreateDTO] instance.
  ProductRecipeItemCreateDTO({
    this.stockResourceId,
    this.quantity,
    this.unitType,
    this.notes,
  });

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'unitType')
  final ProductRecipeItemCreateDTOUnitTypeEnum? unitType;

  @JsonKey(name: r'notes')
  final String? notes;

  /// The factory instance for creating [ProductRecipeItemCreateDTO] from JSON.
  static const factory = ProductRecipeItemCreateDTOFactory();

  factory ProductRecipeItemCreateDTO.fromJson(Map<String, dynamic> json) => _$ProductRecipeItemCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductRecipeItemCreateDTOToJson(this);

  static List<ProductRecipeItemCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeItemCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeItemCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeItemCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeItemCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeItemCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductRecipeItemCreateDTOFactory extends JsonSchemaFactory<ProductRecipeItemCreateDTO> {
  const ProductRecipeItemCreateDTOFactory();

  @override
  ProductRecipeItemCreateDTO fromJson(dynamic json) => ProductRecipeItemCreateDTO.fromJson(json as Map<String, dynamic>);
}



enum ProductRecipeItemCreateDTOUnitTypeEnum {
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

const ProductRecipeItemCreateDTOUnitTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




