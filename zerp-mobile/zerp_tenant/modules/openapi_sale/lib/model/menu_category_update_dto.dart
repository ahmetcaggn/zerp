//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'menu_category_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuCategoryUpdateDTO extends Schema {
  /// Returns a new [MenuCategoryUpdateDTO] instance.
  MenuCategoryUpdateDTO({
    this.name,
    this.description,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  /// The factory instance for creating [MenuCategoryUpdateDTO] from JSON.
  static const factory = MenuCategoryUpdateDTOFactory();

  factory MenuCategoryUpdateDTO.fromJson(Map<String, dynamic> json) => _$MenuCategoryUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuCategoryUpdateDTOToJson(this);

  static List<MenuCategoryUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuCategoryUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuCategoryUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuCategoryUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, MenuCategoryUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuCategoryUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuCategoryUpdateDTOFactory extends JsonSchemaFactory<MenuCategoryUpdateDTO> {
  const MenuCategoryUpdateDTOFactory();

  @override
  MenuCategoryUpdateDTO fromJson(dynamic json) => MenuCategoryUpdateDTO.fromJson(json as Map<String, dynamic>);
}




