//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'team_member_candidate_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TeamMemberCandidateResponse extends Schema {
  /// Returns a new [TeamMemberCandidateResponse] instance.
  TeamMemberCandidateResponse({
    this.id,
    this.username,
    this.email,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'username')
  final String? username;

  @JsonKey(name: r'email')
  final String? email;

  /// The factory instance for creating [TeamMemberCandidateResponse] from JSON.
  static const factory = TeamMemberCandidateResponseFactory();

  factory TeamMemberCandidateResponse.fromJson(Map<String, dynamic> json) => _$TeamMemberCandidateResponseFromJson(json);

  Map<String, dynamic> toJson() => _$TeamMemberCandidateResponseToJson(this);

  static List<TeamMemberCandidateResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TeamMemberCandidateResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TeamMemberCandidateResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TeamMemberCandidateResponse> mapFromJson(dynamic json) {
    final map = <String, TeamMemberCandidateResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TeamMemberCandidateResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TeamMemberCandidateResponseFactory extends JsonSchemaFactory<TeamMemberCandidateResponse> {
  const TeamMemberCandidateResponseFactory();

  @override
  TeamMemberCandidateResponse fromJson(dynamic json) => TeamMemberCandidateResponse.fromJson(json as Map<String, dynamic>);
}




