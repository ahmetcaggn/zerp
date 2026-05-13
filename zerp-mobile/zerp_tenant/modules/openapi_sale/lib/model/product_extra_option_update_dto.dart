//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'product_extra_option_item_create_dto.dart';


part 'product_extra_option_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductExtraOptionUpdateDTO extends Schema {
  /// Returns a new [ProductExtraOptionUpdateDTO] instance.
  ProductExtraOptionUpdateDTO({
    this.name,
    this.description,
    this.price,
    this.isActive,
    this.items = const [],
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'price')
  final num? price;

  @JsonKey(name: r'isActive')
  final bool? isActive;

  @JsonKey(name: r'items')
  final List<ProductExtraOptionItemCreateDTO> items;

  /// The factory instance for creating [ProductExtraOptionUpdateDTO] from JSON.
  static const factory = ProductExtraOptionUpdateDTOFactory();

  factory ProductExtraOptionUpdateDTO.fromJson(Map<String, dynamic> json) => _$ProductExtraOptionUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductExtraOptionUpdateDTOToJson(this);

  static List<ProductExtraOptionUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductExtraOptionUpdateDTOFactory extends JsonSchemaFactory<ProductExtraOptionUpdateDTO> {
  const ProductExtraOptionUpdateDTOFactory();

  @override
  ProductExtraOptionUpdateDTO fromJson(dynamic json) => ProductExtraOptionUpdateDTO.fromJson(json as Map<String, dynamic>);
}




