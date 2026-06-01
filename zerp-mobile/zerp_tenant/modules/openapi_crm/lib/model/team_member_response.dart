//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'team_member_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TeamMemberResponse extends Schema {
  /// Returns a new [TeamMemberResponse] instance.
  TeamMemberResponse({
    this.id,
    this.userId,
    this.displayName,
    this.username,
    this.email,
    this.role,
    this.joinedAt,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'userId')
  final String? userId;

  @JsonKey(name: r'displayName')
  final String? displayName;

  @JsonKey(name: r'username')
  final String? username;

  @JsonKey(name: r'email')
  final String? email;

  @JsonKey(name: r'role')
  final String? role;

  @JsonKey(name: r'joinedAt')
  final DateTime? joinedAt;

  /// The factory instance for creating [TeamMemberResponse] from JSON.
  static const factory = TeamMemberResponseFactory();

  factory TeamMemberResponse.fromJson(Map<String, dynamic> json) => _$TeamMemberResponseFromJson(json);

  Map<String, dynamic> toJson() => _$TeamMemberResponseToJson(this);

  static List<TeamMemberResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TeamMemberResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TeamMemberResponse.fromJson(row as Map<String, dynamic>);
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
        final value = TeamMemberResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TeamMemberResponseFactory extends JsonSchemaFactory<TeamMemberResponse> {
  const TeamMemberResponseFactory();

  @override
  TeamMemberResponse fromJson(dynamic json) => TeamMemberResponse.fromJson(json as Map<String, dynamic>);
}




