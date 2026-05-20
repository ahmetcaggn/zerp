//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'product_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductDTO extends Schema {
  /// Returns a new [ProductDTO] instance.
  ProductDTO({
    this.id,
    this.name,
    this.description,
    this.imageId,
    this.shopId,
    this.shopName,
    this.typeId,
    this.typeName,
    this.metricId,
    this.metricName,
    this.preparationTime,
    this.tenantId,
    this.active,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'imageId')
  final String? imageId;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'shopName')
  final String? shopName;

  @JsonKey(name: r'typeId')
  final String? typeId;

  @JsonKey(name: r'typeName')
  final String? typeName;

  @JsonKey(name: r'metricId')
  final String? metricId;

  @JsonKey(name: r'metricName')
  final String? metricName;

  @JsonKey(name: r'preparationTime')
  final int? preparationTime;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  @JsonKey(name: r'active')
  final bool? active;

  /// The factory instance for creating [ProductDTO] from JSON.
  static const factory = ProductDTOFactory();

  factory ProductDTO.fromJson(Map<String, dynamic> json) => _$ProductDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductDTOToJson(this);

  static List<ProductDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductDTO> mapFromJson(dynamic json) {
    final map = <String, ProductDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductDTOFactory extends JsonSchemaFactory<ProductDTO> {
  const ProductDTOFactory();

  @override
  ProductDTO fromJson(dynamic json) => ProductDTO.fromJson(json as Map<String, dynamic>);
}




