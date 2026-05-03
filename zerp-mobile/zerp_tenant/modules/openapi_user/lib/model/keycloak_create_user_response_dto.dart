//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class KeycloakCreateUserResponseDTO extends Schema {
  /// Returns a new [KeycloakCreateUserResponseDTO] instance.
  KeycloakCreateUserResponseDTO({
    this.userId,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? userId;

  /// The factory instance for creating [KeycloakCreateUserResponseDTO] from JSON.
  static const factory = KeycloakCreateUserResponseDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is KeycloakCreateUserResponseDTO &&
    other.userId == userId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (userId == null ? 0 : userId!.hashCode);

  @override
  String toString() => 'KeycloakCreateUserResponseDTO[userId=$userId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.userId != null) {
      json[r'userId'] = this.userId;
    } else {
      json[r'userId'] = null;
    }
    return json;
  }

  /// Returns a new [KeycloakCreateUserResponseDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static KeycloakCreateUserResponseDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "KeycloakCreateUserResponseDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "KeycloakCreateUserResponseDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return KeycloakCreateUserResponseDTO(
        userId: json[r'userId'] is String ? json[r'userId'] as String : null,
      );
    }
    return null;
  }

  static List<KeycloakCreateUserResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <KeycloakCreateUserResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = KeycloakCreateUserResponseDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, KeycloakCreateUserResponseDTO> mapFromJson(dynamic json) {
    final map = <String, KeycloakCreateUserResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = KeycloakCreateUserResponseDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of KeycloakCreateUserResponseDTO-objects as value to a dart map
  static Map<String, List<KeycloakCreateUserResponseDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<KeycloakCreateUserResponseDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = KeycloakCreateUserResponseDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [KeycloakCreateUserResponseDTO] instances from JSON data.
class KeycloakCreateUserResponseDTOFactory extends JsonSchemaFactory<KeycloakCreateUserResponseDTO> {
  const KeycloakCreateUserResponseDTOFactory();

  @override
  KeycloakCreateUserResponseDTO fromJson(dynamic json) => KeycloakCreateUserResponseDTO.fromJson(json)!;
}

