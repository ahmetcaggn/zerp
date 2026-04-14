//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class ManagerDto extends Schema {
  /// Returns a new [ManagerDto] instance.
  ManagerDto({
    this.id,
    this.firstName,
    this.lastName,
    this.email,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? id;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? firstName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? lastName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? email;

  /// The factory instance for creating [ManagerDto] from JSON.
  static const factory = ManagerDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ManagerDto &&
    other.id == id &&
    other.firstName == firstName &&
    other.lastName == lastName &&
    other.email == email;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (firstName == null ? 0 : firstName!.hashCode) +
    (lastName == null ? 0 : lastName!.hashCode) +
    (email == null ? 0 : email!.hashCode);

  @override
  String toString() => 'ManagerDto[id=$id, firstName=$firstName, lastName=$lastName, email=$email]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.firstName != null) {
      json[r'firstName'] = this.firstName;
    } else {
      json[r'firstName'] = null;
    }
    if (this.lastName != null) {
      json[r'lastName'] = this.lastName;
    } else {
      json[r'lastName'] = null;
    }
    if (this.email != null) {
      json[r'email'] = this.email;
    } else {
      json[r'email'] = null;
    }
    return json;
  }

  /// Returns a new [ManagerDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ManagerDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ManagerDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ManagerDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ManagerDto(
        id: json[r'id'] is int ? json[r'id'] as int : null,
        firstName: json[r'firstName'] is String ? json[r'firstName'] as String : null,
        lastName: json[r'lastName'] is String ? json[r'lastName'] as String : null,
        email: json[r'email'] is String ? json[r'email'] as String : null,
      );
    }
    return null;
  }

  static List<ManagerDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ManagerDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ManagerDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ManagerDto> mapFromJson(dynamic json) {
    final map = <String, ManagerDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ManagerDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ManagerDto-objects as value to a dart map
  static Map<String, List<ManagerDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ManagerDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ManagerDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ManagerDto] instances from JSON data.
class ManagerDtoFactory extends JsonSchemaFactory<ManagerDto> {
  const ManagerDtoFactory();

  @override
  ManagerDto fromJson(dynamic json) => ManagerDto.fromJson(json)!;
}

