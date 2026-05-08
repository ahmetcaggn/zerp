//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class MenuCreateDTO extends Schema {
  /// Returns a new [MenuCreateDTO] instance.
  MenuCreateDTO({
    this.name,
    this.description,
    this.shopId,
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

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? shopId;

  /// The factory instance for creating [MenuCreateDTO] from JSON.
  static const factory = MenuCreateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is MenuCreateDTO &&
    other.name == name &&
    other.description == description &&
    other.shopId == shopId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (shopId == null ? 0 : shopId!.hashCode);

  @override
  String toString() => 'MenuCreateDTO[name=$name, description=$description, shopId=$shopId]';

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
    if (this.shopId != null) {
      json[r'shopId'] = this.shopId;
    } else {
      json[r'shopId'] = null;
    }
    return json;
  }

  /// Returns a new [MenuCreateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static MenuCreateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "MenuCreateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "MenuCreateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return MenuCreateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        shopId: json[r'shopId'] is String ? json[r'shopId'] as String : null,
      );
    }
    return null;
  }

  static List<MenuCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuCreateDTO.fromJson(row);
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
        final value = MenuCreateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of MenuCreateDTO-objects as value to a dart map
  static Map<String, List<MenuCreateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<MenuCreateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = MenuCreateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [MenuCreateDTO] instances from JSON data.
class MenuCreateDTOFactory extends JsonSchemaFactory<MenuCreateDTO> {
  const MenuCreateDTOFactory();

  @override
  MenuCreateDTO fromJson(dynamic json) => MenuCreateDTO.fromJson(json)!;
}

