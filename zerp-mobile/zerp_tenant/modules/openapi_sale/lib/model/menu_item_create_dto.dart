//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'menu_item_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuItemCreateDTO extends Schema {
  /// Returns a new [MenuItemCreateDTO] instance.
  MenuItemCreateDTO({
    this.name,
    this.description,
    this.price,
    this.imageId,
    this.categoryId,
    this.productIds = const [],
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'price')
  final num? price;

  @JsonKey(name: r'imageId')
  final String? imageId;

  @JsonKey(name: r'categoryId')
  final String? categoryId;

  @JsonKey(name: r'productIds')
  final List<String> productIds;

  /// The factory instance for creating [MenuItemCreateDTO] from JSON.
  static const factory = MenuItemCreateDTOFactory();

  factory MenuItemCreateDTO.fromJson(Map<String, dynamic> json) => _$MenuItemCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuItemCreateDTOToJson(this);

  static List<MenuItemCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuItemCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuItemCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuItemCreateDTO> mapFromJson(dynamic json) {
    final map = <String, MenuItemCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuItemCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuItemCreateDTOFactory extends JsonSchemaFactory<MenuItemCreateDTO> {
  const MenuItemCreateDTOFactory();

  @override
  MenuItemCreateDTO fromJson(dynamic json) => MenuItemCreateDTO.fromJson(json as Map<String, dynamic>);
}




