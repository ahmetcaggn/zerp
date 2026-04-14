//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class Parameter extends Schema {
  /// Returns a new [Parameter] instance.
  Parameter({
    this.key,
    this.value,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? key;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? value;

  /// The factory instance for creating [Parameter] from JSON.
  static const factory = ParameterFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is Parameter &&
    other.key == key &&
    other.value == value;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (key == null ? 0 : key!.hashCode) +
    (value == null ? 0 : value!.hashCode);

  @override
  String toString() => 'Parameter[key=$key, value=$value]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.key != null) {
      json[r'key'] = this.key;
    } else {
      json[r'key'] = null;
    }
    if (this.value != null) {
      json[r'value'] = this.value;
    } else {
      json[r'value'] = null;
    }
    return json;
  }

  /// Returns a new [Parameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Parameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "Parameter[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "Parameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Parameter(
        key: json[r'key'] is String ? json[r'key'] as String : null,
        value: json[r'value'] is String ? json[r'value'] as String : null,
      );
    }
    return null;
  }

  static List<Parameter> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <Parameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Parameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Parameter> mapFromJson(dynamic json) {
    final map = <String, Parameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Parameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Parameter-objects as value to a dart map
  static Map<String, List<Parameter>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<Parameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Parameter.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [Parameter] instances from JSON data.
class ParameterFactory extends JsonSchemaFactory<Parameter> {
  const ParameterFactory();

  @override
  Parameter fromJson(dynamic json) => Parameter.fromJson(json)!;
}

