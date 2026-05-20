//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'assignment_team_candidate_response.dart';
import 'meta.dart';
import 'parameter.dart';


part 'api_response_list_assignment_team_candidate_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseListAssignmentTeamCandidateResponse extends Schema {
  /// Returns a new [ApiResponseListAssignmentTeamCandidateResponse] instance.
  ApiResponseListAssignmentTeamCandidateResponse({
    this.success,
    this.statusCode,
    this.message,
    this.data = const [],
    this.meta,
    this.parameters = const [],
  });

  @JsonKey(name: r'success')
  final bool? success;

  @JsonKey(name: r'statusCode')
  final int? statusCode;

  @JsonKey(name: r'message')
  final String? message;

  @JsonKey(name: r'data')
  final List<AssignmentTeamCandidateResponse> data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseListAssignmentTeamCandidateResponse] from JSON.
  static const factory = ApiResponseListAssignmentTeamCandidateResponseFactory();

  factory ApiResponseListAssignmentTeamCandidateResponse.fromJson(Map<String, dynamic> json) => _$ApiResponseListAssignmentTeamCandidateResponseFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseListAssignmentTeamCandidateResponseToJson(this);

  static List<ApiResponseListAssignmentTeamCandidateResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseListAssignmentTeamCandidateResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseListAssignmentTeamCandidateResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseListAssignmentTeamCandidateResponse> mapFromJson(dynamic json) {
    final map = <String, ApiResponseListAssignmentTeamCandidateResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseListAssignmentTeamCandidateResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseListAssignmentTeamCandidateResponseFactory extends JsonSchemaFactory<ApiResponseListAssignmentTeamCandidateResponse> {
  const ApiResponseListAssignmentTeamCandidateResponseFactory();

  @override
  ApiResponseListAssignmentTeamCandidateResponse fromJson(dynamic json) => ApiResponseListAssignmentTeamCandidateResponse.fromJson(json as Map<String, dynamic>);
}




