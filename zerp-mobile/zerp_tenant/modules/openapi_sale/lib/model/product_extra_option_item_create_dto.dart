//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'product_extra_option_item_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductExtraOptionItemCreateDTO extends Schema {
  /// Returns a new [ProductExtraOptionItemCreateDTO] instance.
  ProductExtraOptionItemCreateDTO({
    this.stockResourceId,
    this.quantity,
    this.unitType,
  });

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'unitType')
  final ProductExtraOptionItemCreateDTOUnitTypeEnum? unitType;

  /// The factory instance for creating [ProductExtraOptionItemCreateDTO] from JSON.
  static const factory = ProductExtraOptionItemCreateDTOFactory();

  factory ProductExtraOptionItemCreateDTO.fromJson(Map<String, dynamic> json) => _$ProductExtraOptionItemCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductExtraOptionItemCreateDTOToJson(this);

  static List<ProductExtraOptionItemCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionItemCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionItemCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionItemCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionItemCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionItemCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductExtraOptionItemCreateDTOFactory extends JsonSchemaFactory<ProductExtraOptionItemCreateDTO> {
  const ProductExtraOptionItemCreateDTOFactory();

  @override
  ProductExtraOptionItemCreateDTO fromJson(dynamic json) => ProductExtraOptionItemCreateDTO.fromJson(json as Map<String, dynamic>);
}



enum ProductExtraOptionItemCreateDTOUnitTypeEnum {
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

const ProductExtraOptionItemCreateDTOUnitTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




