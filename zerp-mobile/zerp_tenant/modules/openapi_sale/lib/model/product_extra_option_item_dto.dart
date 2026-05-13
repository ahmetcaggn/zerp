//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'product_extra_option_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductExtraOptionItemDTO extends Schema {
  /// Returns a new [ProductExtraOptionItemDTO] instance.
  ProductExtraOptionItemDTO({
    this.id,
    this.stockResourceId,
    this.stockResourceName,
    this.quantity,
    this.unitType,
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
  final ProductExtraOptionItemDTOUnitTypeEnum? unitType;

  /// The factory instance for creating [ProductExtraOptionItemDTO] from JSON.
  static const factory = ProductExtraOptionItemDTOFactory();

  factory ProductExtraOptionItemDTO.fromJson(Map<String, dynamic> json) => _$ProductExtraOptionItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductExtraOptionItemDTOToJson(this);

  static List<ProductExtraOptionItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionItemDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductExtraOptionItemDTOFactory extends JsonSchemaFactory<ProductExtraOptionItemDTO> {
  const ProductExtraOptionItemDTOFactory();

  @override
  ProductExtraOptionItemDTO fromJson(dynamic json) => ProductExtraOptionItemDTO.fromJson(json as Map<String, dynamic>);
}



enum ProductExtraOptionItemDTOUnitTypeEnum {
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

const ProductExtraOptionItemDTOUnitTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




