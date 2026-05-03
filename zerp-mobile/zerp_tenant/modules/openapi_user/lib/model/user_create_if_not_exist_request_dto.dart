//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class UserCreateIfNotExistRequestDTO extends Schema {
  /// Returns a new [UserCreateIfNotExistRequestDTO] instance.
  UserCreateIfNotExistRequestDTO({
    this.id,
    this.username,
    this.email,
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
  final String? username;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? email;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? tenantId;

  /// The factory instance for creating [UserCreateIfNotExistRequestDTO] from JSON.
  static const factory = UserCreateIfNotExistRequestDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is UserCreateIfNotExistRequestDTO &&
    other.id == id &&
    other.username == username &&
    other.email == email &&
    other.tenantId == tenantId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (username == null ? 0 : username!.hashCode) +
    (email == null ? 0 : email!.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode);

  @override
  String toString() => 'UserCreateIfNotExistRequestDTO[id=$id, username=$username, email=$email, tenantId=$tenantId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.username != null) {
      json[r'username'] = this.username;
    } else {
      json[r'username'] = null;
    }
    if (this.email != null) {
      json[r'email'] = this.email;
    } else {
      json[r'email'] = null;
    }
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    return json;
  }

  /// Returns a new [UserCreateIfNotExistRequestDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UserCreateIfNotExistRequestDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "UserCreateIfNotExistRequestDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "UserCreateIfNotExistRequestDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UserCreateIfNotExistRequestDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        username: json[r'username'] is String ? json[r'username'] as String : null,
        email: json[r'email'] is String ? json[r'email'] as String : null,
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
      );
    }
    return null;
  }

  static List<UserCreateIfNotExistRequestDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UserCreateIfNotExistRequestDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UserCreateIfNotExistRequestDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UserCreateIfNotExistRequestDTO> mapFromJson(dynamic json) {
    final map = <String, UserCreateIfNotExistRequestDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UserCreateIfNotExistRequestDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UserCreateIfNotExistRequestDTO-objects as value to a dart map
  static Map<String, List<UserCreateIfNotExistRequestDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<UserCreateIfNotExistRequestDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UserCreateIfNotExistRequestDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [UserCreateIfNotExistRequestDTO] instances from JSON data.
class UserCreateIfNotExistRequestDTOFactory extends JsonSchemaFactory<UserCreateIfNotExistRequestDTO> {
  const UserCreateIfNotExistRequestDTOFactory();

  @override
  UserCreateIfNotExistRequestDTO fromJson(dynamic json) => UserCreateIfNotExistRequestDTO.fromJson(json)!;
}

