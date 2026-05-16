//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'product_extra_option_item_dto.dart';


part 'product_extra_option_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductExtraOptionDTO extends Schema {
  /// Returns a new [ProductExtraOptionDTO] instance.
  ProductExtraOptionDTO({
    this.id,
    this.productId,
    this.productName,
    this.name,
    this.description,
    this.price,
    this.items = const [],
    this.tenantId,
    this.active,
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

  @JsonKey(name: r'price')
  final num? price;

  @JsonKey(name: r'items')
  final List<ProductExtraOptionItemDTO> items;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  @JsonKey(name: r'active')
  final bool? active;

  /// The factory instance for creating [ProductExtraOptionDTO] from JSON.
  static const factory = ProductExtraOptionDTOFactory();

  factory ProductExtraOptionDTO.fromJson(Map<String, dynamic> json) => _$ProductExtraOptionDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductExtraOptionDTOToJson(this);

  static List<ProductExtraOptionDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductExtraOptionDTOFactory extends JsonSchemaFactory<ProductExtraOptionDTO> {
  const ProductExtraOptionDTOFactory();

  @override
  ProductExtraOptionDTO fromJson(dynamic json) => ProductExtraOptionDTO.fromJson(json as Map<String, dynamic>);
}




