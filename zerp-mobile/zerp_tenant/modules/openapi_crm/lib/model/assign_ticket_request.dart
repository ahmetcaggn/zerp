//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class AssignTicketRequest extends Schema {
  /// Returns a new [AssignTicketRequest] instance.
  AssignTicketRequest({
    this.teamId,
    this.agentPartyId,
  });

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

  /// The factory instance for creating [AssignTicketRequest] from JSON.
  static const factory = AssignTicketRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is AssignTicketRequest &&
    other.teamId == teamId &&
    other.agentPartyId == agentPartyId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (teamId == null ? 0 : teamId!.hashCode) +
    (agentPartyId == null ? 0 : agentPartyId!.hashCode);

  @override
  String toString() => 'AssignTicketRequest[teamId=$teamId, agentPartyId=$agentPartyId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
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
    return json;
  }

  /// Returns a new [AssignTicketRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AssignTicketRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "AssignTicketRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "AssignTicketRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AssignTicketRequest(
        teamId: json[r'teamId'] is String ? json[r'teamId'] as String : null,
        agentPartyId: json[r'agentPartyId'] is String ? json[r'agentPartyId'] as String : null,
      );
    }
    return null;
  }

  static List<AssignTicketRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AssignTicketRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AssignTicketRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AssignTicketRequest> mapFromJson(dynamic json) {
    final map = <String, AssignTicketRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AssignTicketRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AssignTicketRequest-objects as value to a dart map
  static Map<String, List<AssignTicketRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<AssignTicketRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AssignTicketRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [AssignTicketRequest] instances from JSON data.
class AssignTicketRequestFactory extends JsonSchemaFactory<AssignTicketRequest> {
  const AssignTicketRequestFactory();

  @override
  AssignTicketRequest fromJson(dynamic json) => AssignTicketRequest.fromJson(json)!;
}

