//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class TicketAssignmentResponse extends Schema {
  /// Returns a new [TicketAssignmentResponse] instance.
  TicketAssignmentResponse({
    this.id,
    this.teamId,
    this.agentPartyId,
    this.active,
    this.assignedAt,
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
  final String? teamId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? agentPartyId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? active;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? assignedAt;

  /// The factory instance for creating [TicketAssignmentResponse] from JSON.
  static const factory = TicketAssignmentResponseFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is TicketAssignmentResponse &&
    other.id == id &&
    other.teamId == teamId &&
    other.agentPartyId == agentPartyId &&
    other.active == active &&
    other.assignedAt == assignedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (teamId == null ? 0 : teamId!.hashCode) +
    (agentPartyId == null ? 0 : agentPartyId!.hashCode) +
    (active == null ? 0 : active!.hashCode) +
    (assignedAt == null ? 0 : assignedAt!.hashCode);

  @override
  String toString() => 'TicketAssignmentResponse[id=$id, teamId=$teamId, agentPartyId=$agentPartyId, active=$active, assignedAt=$assignedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.teamId != null) {
      json[r'teamId'] = this.teamId;
    } else {
      json[r'teamId'] = null;
    }
    if (this.agentPartyId != null) {
      json[r'agentPartyId'] = this.agentPartyId;
    } else {
      json[r'agentPartyId'] = null;
    }
    if (this.active != null) {
      json[r'active'] = this.active;
    } else {
      json[r'active'] = null;
    }
    if (this.assignedAt != null) {
      json[r'assignedAt'] = this.assignedAt!.toUtc().toIso8601String();
    } else {
      json[r'assignedAt'] = null;
    }
    return json;
  }

  /// Returns a new [TicketAssignmentResponse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TicketAssignmentResponse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "TicketAssignmentResponse[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "TicketAssignmentResponse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TicketAssignmentResponse(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        teamId: json[r'teamId'] is String ? json[r'teamId'] as String : null,
        agentPartyId: json[r'agentPartyId'] is String ? json[r'agentPartyId'] as String : null,
        active: json[r'active'] is bool ? json[r'active'] as bool : null,
        assignedAt: json[r'assignedAt'] != null ? DateTime.parse(json[r'assignedAt'].toString()) : null,
      );
    }
    return null;
  }

  static List<TicketAssignmentResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TicketAssignmentResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TicketAssignmentResponse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TicketAssignmentResponse> mapFromJson(dynamic json) {
    final map = <String, TicketAssignmentResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TicketAssignmentResponse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TicketAssignmentResponse-objects as value to a dart map
  static Map<String, List<TicketAssignmentResponse>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<TicketAssignmentResponse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TicketAssignmentResponse.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [TicketAssignmentResponse] instances from JSON data.
class TicketAssignmentResponseFactory extends JsonSchemaFactory<TicketAssignmentResponse> {
  const TicketAssignmentResponseFactory();

  @override
  TicketAssignmentResponse fromJson(dynamic json) => TicketAssignmentResponse.fromJson(json)!;
}

