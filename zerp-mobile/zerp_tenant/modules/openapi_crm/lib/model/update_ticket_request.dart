//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class UpdateTicketRequest extends Schema {
  /// Returns a new [UpdateTicketRequest] instance.
  UpdateTicketRequest({
    this.title,
    this.description,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? title;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? description;

  /// The factory instance for creating [UpdateTicketRequest] from JSON.
  static const factory = UpdateTicketRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is UpdateTicketRequest &&
    other.title == title &&
    other.description == description;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (title == null ? 0 : title!.hashCode) +
    (description == null ? 0 : description!.hashCode);

  @override
  String toString() => 'UpdateTicketRequest[title=$title, description=$description]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.title != null) {
      json[r'title'] = this.title;
    } else {
      json[r'title'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    return json;
  }

  /// Returns a new [UpdateTicketRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UpdateTicketRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "UpdateTicketRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "UpdateTicketRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UpdateTicketRequest(
        title: json[r'title'] is String ? json[r'title'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
      );
    }
    return null;
  }

  static List<UpdateTicketRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UpdateTicketRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateTicketRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UpdateTicketRequest> mapFromJson(dynamic json) {
    final map = <String, UpdateTicketRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UpdateTicketRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UpdateTicketRequest-objects as value to a dart map
  static Map<String, List<UpdateTicketRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<UpdateTicketRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UpdateTicketRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [UpdateTicketRequest] instances from JSON data.
class UpdateTicketRequestFactory extends JsonSchemaFactory<UpdateTicketRequest> {
  const UpdateTicketRequestFactory();

  @override
  UpdateTicketRequest fromJson(dynamic json) => UpdateTicketRequest.fromJson(json)!;
}

