//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class TeamMemberResponse extends Schema {
  /// Returns a new [TeamMemberResponse] instance.
  TeamMemberResponse({
    this.id,
    this.userId,
    this.role,
    this.joinedAt,
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
  final String? userId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? role;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? joinedAt;

  /// The factory instance for creating [TeamMemberResponse] from JSON.
  static const factory = TeamMemberResponseFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is TeamMemberResponse &&
    other.id == id &&
    other.userId == userId &&
    other.role == role &&
    other.joinedAt == joinedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (userId == null ? 0 : userId!.hashCode) +
    (role == null ? 0 : role!.hashCode) +
    (joinedAt == null ? 0 : joinedAt!.hashCode);

  @override
  String toString() => 'TeamMemberResponse[id=$id, userId=$userId, role=$role, joinedAt=$joinedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.userId != null) {
      json[r'userId'] = this.userId;
    } else {
      json[r'userId'] = null;
    }
    if (this.role != null) {
      json[r'role'] = this.role;
    } else {
      json[r'role'] = null;
    }
    if (this.joinedAt != null) {
      json[r'joinedAt'] = this.joinedAt!.toUtc().toIso8601String();
    } else {
      json[r'joinedAt'] = null;
    }
    return json;
  }

  /// Returns a new [TeamMemberResponse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TeamMemberResponse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "TeamMemberResponse[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "TeamMemberResponse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TeamMemberResponse(
        id: json[r'id'] is int ? json[r'id'] as int : null,
        userId: json[r'userId'] is String ? json[r'userId'] as String : null,
        role: json[r'role'] is String ? json[r'role'] as String : null,
        joinedAt: json[r'joinedAt'] != null ? DateTime.parse(json[r'joinedAt'].toString()) : null,
      );
    }
    return null;
  }

  static List<TeamMemberResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TeamMemberResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TeamMemberResponse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TeamMemberResponse> mapFromJson(dynamic json) {
    final map = <String, TeamMemberResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TeamMemberResponse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TeamMemberResponse-objects as value to a dart map
  static Map<String, List<TeamMemberResponse>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<TeamMemberResponse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TeamMemberResponse.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [TeamMemberResponse] instances from JSON data.
class TeamMemberResponseFactory extends JsonSchemaFactory<TeamMemberResponse> {
  const TeamMemberResponseFactory();

  @override
  TeamMemberResponse fromJson(dynamic json) => TeamMemberResponse.fromJson(json)!;
}

