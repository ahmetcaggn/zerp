//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class MenuCategoryDTO extends Schema {
  /// Returns a new [MenuCategoryDTO] instance.
  MenuCategoryDTO({
    this.id,
    this.name,
    this.description,
    this.menuId,
    this.menuName,
    this.tenantId,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? id;

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
  final String? menuId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? menuName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? tenantId;

  /// The factory instance for creating [MenuCategoryDTO] from JSON.
  static const factory = MenuCategoryDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is MenuCategoryDTO &&
    other.id == id &&
    other.name == name &&
    other.description == description &&
    other.menuId == menuId &&
    other.menuName == menuName &&
    other.tenantId == tenantId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (menuId == null ? 0 : menuId!.hashCode) +
    (menuName == null ? 0 : menuName!.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode);

  @override
  String toString() => 'MenuCategoryDTO[id=$id, name=$name, description=$description, menuId=$menuId, menuName=$menuName, tenantId=$tenantId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
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
    if (this.menuId != null) {
      json[r'menuId'] = this.menuId;
    } else {
      json[r'menuId'] = null;
    }
    if (this.menuName != null) {
      json[r'menuName'] = this.menuName;
    } else {
      json[r'menuName'] = null;
    }
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    return json;
  }

  /// Returns a new [MenuCategoryDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static MenuCategoryDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "MenuCategoryDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "MenuCategoryDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return MenuCategoryDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        menuId: json[r'menuId'] is String ? json[r'menuId'] as String : null,
        menuName: json[r'menuName'] is String ? json[r'menuName'] as String : null,
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
      );
    }
    return null;
  }

  static List<MenuCategoryDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuCategoryDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuCategoryDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuCategoryDTO> mapFromJson(dynamic json) {
    final map = <String, MenuCategoryDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuCategoryDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of MenuCategoryDTO-objects as value to a dart map
  static Map<String, List<MenuCategoryDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<MenuCategoryDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = MenuCategoryDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [MenuCategoryDTO] instances from JSON data.
class MenuCategoryDTOFactory extends JsonSchemaFactory<MenuCategoryDTO> {
  const MenuCategoryDTOFactory();

  @override
  MenuCategoryDTO fromJson(dynamic json) => MenuCategoryDTO.fromJson(json)!;
}

