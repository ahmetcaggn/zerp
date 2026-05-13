//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'team_member_response.dart';


part 'team_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TeamResponse extends Schema {
  /// Returns a new [TeamResponse] instance.
  TeamResponse({
    this.id,
    this.name,
    this.description,
    this.type,
    this.isActive,
    this.members = const [],
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'type')
  final String? type;

  @JsonKey(name: r'isActive')
  final bool? isActive;

  @JsonKey(name: r'members')
  final List<TeamMemberResponse> members;

  /// The factory instance for creating [TeamResponse] from JSON.
  static const factory = TeamResponseFactory();

  factory TeamResponse.fromJson(Map<String, dynamic> json) => _$TeamResponseFromJson(json);

  Map<String, dynamic> toJson() => _$TeamResponseToJson(this);

  static List<TeamResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TeamResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TeamResponse.fromJson(row as Map<String, dynamic>);
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
        final value = TeamResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TeamResponseFactory extends JsonSchemaFactory<TeamResponse> {
  const TeamResponseFactory();

  @override
  TeamResponse fromJson(dynamic json) => TeamResponse.fromJson(json as Map<String, dynamic>);
}




