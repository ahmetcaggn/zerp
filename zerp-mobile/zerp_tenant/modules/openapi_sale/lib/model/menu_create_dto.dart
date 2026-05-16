//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'menu_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuCreateDTO extends Schema {
  /// Returns a new [MenuCreateDTO] instance.
  MenuCreateDTO({
    this.name,
    this.description,
    this.shopId,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'shopId')
  final String? shopId;

  /// The factory instance for creating [MenuCreateDTO] from JSON.
  static const factory = MenuCreateDTOFactory();

  factory MenuCreateDTO.fromJson(Map<String, dynamic> json) => _$MenuCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuCreateDTOToJson(this);

  static List<MenuCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuCreateDTO> mapFromJson(dynamic json) {
    final map = <String, MenuCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuCreateDTOFactory extends JsonSchemaFactory<MenuCreateDTO> {
  const MenuCreateDTOFactory();

  @override
  MenuCreateDTO fromJson(dynamic json) => MenuCreateDTO.fromJson(json as Map<String, dynamic>);
}




