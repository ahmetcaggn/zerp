//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'assignment_team_member_candidate_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AssignmentTeamMemberCandidateResponse extends Schema {
  /// Returns a new [AssignmentTeamMemberCandidateResponse] instance.
  AssignmentTeamMemberCandidateResponse({
    this.userId,
    this.displayName,
    this.email,
    this.role,
    this.displayLabel,
  });

  @JsonKey(name: r'userId')
  final String? userId;

  @JsonKey(name: r'displayName')
  final String? displayName;

  @JsonKey(name: r'email')
  final String? email;

  @JsonKey(name: r'role')
  final String? role;

  @JsonKey(name: r'displayLabel')
  final String? displayLabel;

  /// The factory instance for creating [AssignmentTeamMemberCandidateResponse] from JSON.
  static const factory = AssignmentTeamMemberCandidateResponseFactory();

  factory AssignmentTeamMemberCandidateResponse.fromJson(Map<String, dynamic> json) => _$AssignmentTeamMemberCandidateResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AssignmentTeamMemberCandidateResponseToJson(this);

  static List<AssignmentTeamMemberCandidateResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AssignmentTeamMemberCandidateResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AssignmentTeamMemberCandidateResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AssignmentTeamMemberCandidateResponse> mapFromJson(dynamic json) {
    final map = <String, AssignmentTeamMemberCandidateResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AssignmentTeamMemberCandidateResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AssignmentTeamMemberCandidateResponseFactory extends JsonSchemaFactory<AssignmentTeamMemberCandidateResponse> {
  const AssignmentTeamMemberCandidateResponseFactory();

  @override
  AssignmentTeamMemberCandidateResponse fromJson(dynamic json) => AssignmentTeamMemberCandidateResponse.fromJson(json as Map<String, dynamic>);
}




