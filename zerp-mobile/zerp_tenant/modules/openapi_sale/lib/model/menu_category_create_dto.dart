//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'menu_category_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuCategoryCreateDTO extends Schema {
  /// Returns a new [MenuCategoryCreateDTO] instance.
  MenuCategoryCreateDTO({
    this.name,
    this.description,
    this.menuId,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'menuId')
  final String? menuId;

  /// The factory instance for creating [MenuCategoryCreateDTO] from JSON.
  static const factory = MenuCategoryCreateDTOFactory();

  factory MenuCategoryCreateDTO.fromJson(Map<String, dynamic> json) => _$MenuCategoryCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuCategoryCreateDTOToJson(this);

  static List<MenuCategoryCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuCategoryCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuCategoryCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuCategoryCreateDTO> mapFromJson(dynamic json) {
    final map = <String, MenuCategoryCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuCategoryCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuCategoryCreateDTOFactory extends JsonSchemaFactory<MenuCategoryCreateDTO> {
  const MenuCategoryCreateDTOFactory();

  @override
  MenuCategoryCreateDTO fromJson(dynamic json) => MenuCategoryCreateDTO.fromJson(json as Map<String, dynamic>);
}




