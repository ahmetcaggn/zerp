//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'assignment_team_candidate_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AssignmentTeamCandidateResponse extends Schema {
  /// Returns a new [AssignmentTeamCandidateResponse] instance.
  AssignmentTeamCandidateResponse({
    this.id,
    this.name,
    this.type,
    this.displayLabel,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'type')
  final String? type;

  @JsonKey(name: r'displayLabel')
  final String? displayLabel;

  /// The factory instance for creating [AssignmentTeamCandidateResponse] from JSON.
  static const factory = AssignmentTeamCandidateResponseFactory();

  factory AssignmentTeamCandidateResponse.fromJson(Map<String, dynamic> json) => _$AssignmentTeamCandidateResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AssignmentTeamCandidateResponseToJson(this);

  static List<AssignmentTeamCandidateResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AssignmentTeamCandidateResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AssignmentTeamCandidateResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AssignmentTeamCandidateResponse> mapFromJson(dynamic json) {
    final map = <String, AssignmentTeamCandidateResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AssignmentTeamCandidateResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AssignmentTeamCandidateResponseFactory extends JsonSchemaFactory<AssignmentTeamCandidateResponse> {
  const AssignmentTeamCandidateResponseFactory();

  @override
  AssignmentTeamCandidateResponse fromJson(dynamic json) => AssignmentTeamCandidateResponse.fromJson(json as Map<String, dynamic>);
}




