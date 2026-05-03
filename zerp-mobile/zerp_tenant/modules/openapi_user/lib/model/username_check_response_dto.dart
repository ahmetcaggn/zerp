//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class UsernameCheckResponseDTO extends Schema {
  /// Returns a new [UsernameCheckResponseDTO] instance.
  UsernameCheckResponseDTO({
    this.username,
    this.available,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? username;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? available;

  /// The factory instance for creating [UsernameCheckResponseDTO] from JSON.
  static const factory = UsernameCheckResponseDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is UsernameCheckResponseDTO &&
    other.username == username &&
    other.available == available;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (username == null ? 0 : username!.hashCode) +
    (available == null ? 0 : available!.hashCode);

  @override
  String toString() => 'UsernameCheckResponseDTO[username=$username, available=$available]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.username != null) {
      json[r'username'] = this.username;
    } else {
      json[r'username'] = null;
    }
    if (this.available != null) {
      json[r'available'] = this.available;
    } else {
      json[r'available'] = null;
    }
    return json;
  }

  /// Returns a new [UsernameCheckResponseDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UsernameCheckResponseDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "UsernameCheckResponseDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "UsernameCheckResponseDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UsernameCheckResponseDTO(
        username: json[r'username'] is String ? json[r'username'] as String : null,
        available: json[r'available'] is bool ? json[r'available'] as bool : null,
      );
    }
    return null;
  }

  static List<UsernameCheckResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UsernameCheckResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UsernameCheckResponseDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UsernameCheckResponseDTO> mapFromJson(dynamic json) {
    final map = <String, UsernameCheckResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UsernameCheckResponseDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UsernameCheckResponseDTO-objects as value to a dart map
  static Map<String, List<UsernameCheckResponseDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<UsernameCheckResponseDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UsernameCheckResponseDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [UsernameCheckResponseDTO] instances from JSON data.
class UsernameCheckResponseDTOFactory extends JsonSchemaFactory<UsernameCheckResponseDTO> {
  const UsernameCheckResponseDTOFactory();

  @override
  UsernameCheckResponseDTO fromJson(dynamic json) => UsernameCheckResponseDTO.fromJson(json)!;
}

