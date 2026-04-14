//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'team_member_response.dart';

class TeamResponse extends Schema {
  /// Returns a new [TeamResponse] instance.
  TeamResponse({
    this.id,
    this.name,
    this.description,
    this.isActive,
    this.members = const [],
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
  final bool? isActive;

  final List<TeamMemberResponse> members;

  /// The factory instance for creating [TeamResponse] from JSON.
  static const factory = TeamResponseFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is TeamResponse &&
    other.id == id &&
    other.name == name &&
    other.description == description &&
    other.isActive == isActive &&
    other.members == members;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (isActive == null ? 0 : isActive!.hashCode) +
    (members.hashCode);

  @override
  String toString() => 'TeamResponse[id=$id, name=$name, description=$description, isActive=$isActive, members=$members]';

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
    if (this.isActive != null) {
      json[r'isActive'] = this.isActive;
    } else {
      json[r'isActive'] = null;
    }
      json[r'members'] = this.members;
    return json;
  }

  /// Returns a new [TeamResponse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TeamResponse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "TeamResponse[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "TeamResponse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TeamResponse(
        id: json[r'id'] is int ? json[r'id'] as int : null,
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        isActive: json[r'isActive'] is bool ? json[r'isActive'] as bool : null,
        members: TeamMemberResponse.listFromJson(json[r'members']),
      );
    }
    return null;
  }

  static List<TeamResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TeamResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TeamResponse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TeamResponse> mapFromJson(dynamic json) {
    final map = <String, TeamResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TeamResponse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TeamResponse-objects as value to a dart map
  static Map<String, List<TeamResponse>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<TeamResponse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TeamResponse.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [TeamResponse] instances from JSON data.
class TeamResponseFactory extends JsonSchemaFactory<TeamResponse> {
  const TeamResponseFactory();

  @override
  TeamResponse fromJson(dynamic json) => TeamResponse.fromJson(json)!;
}

