//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'product_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductUpdateDTO extends Schema {
  /// Returns a new [ProductUpdateDTO] instance.
  ProductUpdateDTO({
    this.name,
    this.description,
    this.imageId,
    this.typeId,
    this.metricId,
    this.menuItemId,
    this.price,
    this.preparationTime,
    this.isActive,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'imageId')
  final String? imageId;

  @JsonKey(name: r'typeId')
  final String? typeId;

  @JsonKey(name: r'metricId')
  final String? metricId;

  @JsonKey(name: r'menuItemId')
  final String? menuItemId;

  @JsonKey(name: r'price')
  final num? price;

  @JsonKey(name: r'preparationTime')
  final int? preparationTime;

  @JsonKey(name: r'isActive')
  final bool? isActive;

  /// The factory instance for creating [ProductUpdateDTO] from JSON.
  static const factory = ProductUpdateDTOFactory();

  factory ProductUpdateDTO.fromJson(Map<String, dynamic> json) => _$ProductUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductUpdateDTOToJson(this);

  static List<ProductUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductUpdateDTOFactory extends JsonSchemaFactory<ProductUpdateDTO> {
  const ProductUpdateDTOFactory();

  @override
  ProductUpdateDTO fromJson(dynamic json) => ProductUpdateDTO.fromJson(json as Map<String, dynamic>);
}




