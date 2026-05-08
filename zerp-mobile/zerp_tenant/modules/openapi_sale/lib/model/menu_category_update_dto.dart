//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class MenuCategoryUpdateDTO extends Schema {
  /// Returns a new [MenuCategoryUpdateDTO] instance.
  MenuCategoryUpdateDTO({
    this.name,
    this.description,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? name;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? description;

  /// The factory instance for creating [MenuCategoryUpdateDTO] from JSON.
  static const factory = MenuCategoryUpdateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is MenuCategoryUpdateDTO &&
    other.name == name &&
    other.description == description;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode);

  @override
  String toString() => 'MenuCategoryUpdateDTO[name=$name, description=$description]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    return json;
  }

  /// Returns a new [MenuCategoryUpdateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static MenuCategoryUpdateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "MenuCategoryUpdateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "MenuCategoryUpdateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return MenuCategoryUpdateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
      );
    }
    return null;
  }

  static List<MenuCategoryUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuCategoryUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuCategoryUpdateDTO.fromJson(row);
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
        final value = MenuCategoryUpdateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of MenuCategoryUpdateDTO-objects as value to a dart map
  static Map<String, List<MenuCategoryUpdateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<MenuCategoryUpdateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = MenuCategoryUpdateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [MenuCategoryUpdateDTO] instances from JSON data.
class MenuCategoryUpdateDTOFactory extends JsonSchemaFactory<MenuCategoryUpdateDTO> {
  const MenuCategoryUpdateDTOFactory();

  @override
  MenuCategoryUpdateDTO fromJson(dynamic json) => MenuCategoryUpdateDTO.fromJson(json)!;
}

