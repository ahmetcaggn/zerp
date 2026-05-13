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


part 'product_extra_option_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductExtraOptionCreateDTO extends Schema {
  /// Returns a new [ProductExtraOptionCreateDTO] instance.
  ProductExtraOptionCreateDTO({
    this.productId,
    this.name,
    this.description,
    this.price,
    this.items = const [],
    this.active,
  });

  @JsonKey(name: r'productId')
  final String? productId;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'price')
  final num? price;

  @JsonKey(name: r'items')
  final List<ProductExtraOptionItemCreateDTO> items;

  @JsonKey(name: r'active')
  final bool? active;

  /// The factory instance for creating [ProductExtraOptionCreateDTO] from JSON.
  static const factory = ProductExtraOptionCreateDTOFactory();

  factory ProductExtraOptionCreateDTO.fromJson(Map<String, dynamic> json) => _$ProductExtraOptionCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductExtraOptionCreateDTOToJson(this);

  static List<ProductExtraOptionCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductExtraOptionCreateDTOFactory extends JsonSchemaFactory<ProductExtraOptionCreateDTO> {
  const ProductExtraOptionCreateDTOFactory();

  @override
  ProductExtraOptionCreateDTO fromJson(dynamic json) => ProductExtraOptionCreateDTO.fromJson(json as Map<String, dynamic>);
}




