//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'product_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ProductCreateDTO extends Schema {
  /// Returns a new [ProductCreateDTO] instance.
  ProductCreateDTO({
    this.name,
    this.description,
    this.imageId,
    this.shopId,
    this.typeId,
    this.metricId,
    this.preparationTime,
    this.active,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'imageId')
  final String? imageId;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'typeId')
  final String? typeId;

  @JsonKey(name: r'metricId')
  final String? metricId;

  @JsonKey(name: r'preparationTime')
  final int? preparationTime;

  @JsonKey(name: r'active')
  final bool? active;

  /// The factory instance for creating [ProductCreateDTO] from JSON.
  static const factory = ProductCreateDTOFactory();

  factory ProductCreateDTO.fromJson(Map<String, dynamic> json) => _$ProductCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ProductCreateDTOToJson(this);

  static List<ProductCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ProductCreateDTOFactory extends JsonSchemaFactory<ProductCreateDTO> {
  const ProductCreateDTOFactory();

  @override
  ProductCreateDTO fromJson(dynamic json) => ProductCreateDTO.fromJson(json as Map<String, dynamic>);
}




