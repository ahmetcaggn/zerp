//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class KeycloakCreateUserRequestDTO extends Schema {
  /// Returns a new [KeycloakCreateUserRequestDTO] instance.
  KeycloakCreateUserRequestDTO({
    required this.username,
    required this.email,
    this.tempPassword,
    required this.tenantId,
  });

  final String username;

  final String email;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? tempPassword;

  final String tenantId;

  /// The factory instance for creating [KeycloakCreateUserRequestDTO] from JSON.
  static const factory = KeycloakCreateUserRequestDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is KeycloakCreateUserRequestDTO &&
    other.username == username &&
    other.email == email &&
    other.tempPassword == tempPassword &&
    other.tenantId == tenantId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (username.hashCode) +
    (email.hashCode) +
    (tempPassword == null ? 0 : tempPassword!.hashCode) +
    (tenantId.hashCode);

  @override
  String toString() => 'KeycloakCreateUserRequestDTO[username=$username, email=$email, tempPassword=$tempPassword, tenantId=$tenantId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'username'] = this.username;
      json[r'email'] = this.email;
    if (this.tempPassword != null) {
      json[r'tempPassword'] = this.tempPassword;
    } else {
      json[r'tempPassword'] = null;
    }
      json[r'tenantId'] = this.tenantId;
    return json;
  }

  /// Returns a new [KeycloakCreateUserRequestDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static KeycloakCreateUserRequestDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "KeycloakCreateUserRequestDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "KeycloakCreateUserRequestDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return KeycloakCreateUserRequestDTO(
        username: json[r'username'] as String,
        email: json[r'email'] as String,
        tempPassword: json[r'tempPassword'] is String ? json[r'tempPassword'] as String : null,
        tenantId: json[r'tenantId'] as String,
      );
    }
    return null;
  }

  static List<KeycloakCreateUserRequestDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <KeycloakCreateUserRequestDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = KeycloakCreateUserRequestDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, KeycloakCreateUserRequestDTO> mapFromJson(dynamic json) {
    final map = <String, KeycloakCreateUserRequestDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = KeycloakCreateUserRequestDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of KeycloakCreateUserRequestDTO-objects as value to a dart map
  static Map<String, List<KeycloakCreateUserRequestDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<KeycloakCreateUserRequestDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = KeycloakCreateUserRequestDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'username',
    'email',
    'tenantId',
  };
}

/// Factory for creating [KeycloakCreateUserRequestDTO] instances from JSON data.
class KeycloakCreateUserRequestDTOFactory extends JsonSchemaFactory<KeycloakCreateUserRequestDTO> {
  const KeycloakCreateUserRequestDTOFactory();

  @override
  KeycloakCreateUserRequestDTO fromJson(dynamic json) => KeycloakCreateUserRequestDTO.fromJson(json)!;
}

