//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'menu_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuUpdateDTO extends Schema {
  /// Returns a new [MenuUpdateDTO] instance.
  MenuUpdateDTO({
    this.name,
    this.description,
    this.isActive,
    this.language,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'isActive')
  final bool? isActive;

  @JsonKey(name: r'language')
  final MenuUpdateDTOLanguageEnum? language;

  /// The factory instance for creating [MenuUpdateDTO] from JSON.
  static const factory = MenuUpdateDTOFactory();

  factory MenuUpdateDTO.fromJson(Map<String, dynamic> json) => _$MenuUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuUpdateDTOToJson(this);

  static List<MenuUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, MenuUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuUpdateDTOFactory extends JsonSchemaFactory<MenuUpdateDTO> {
  const MenuUpdateDTOFactory();

  @override
  MenuUpdateDTO fromJson(dynamic json) => MenuUpdateDTO.fromJson(json as Map<String, dynamic>);
}



enum MenuUpdateDTOLanguageEnum {
@JsonValue('TR')
TR('TR'),
@JsonValue('EN')
EN('EN');

const MenuUpdateDTOLanguageEnum(this.value);

final String value;

@override
String toString() => value;
}




