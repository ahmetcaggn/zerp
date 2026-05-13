//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'update_team_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateTeamRequest extends Schema {
  /// Returns a new [UpdateTeamRequest] instance.
  UpdateTeamRequest({
    this.name,
    this.description,
    this.type,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'type')
  final UpdateTeamRequestTypeEnum? type;

  /// The factory instance for creating [UpdateTeamRequest] from JSON.
  static const factory = UpdateTeamRequestFactory();

  factory UpdateTeamRequest.fromJson(Map<String, dynamic> json) => _$UpdateTeamRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateTeamRequestToJson(this);

  static List<UpdateTeamRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UpdateTeamRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateTeamRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UpdateTeamRequest> mapFromJson(dynamic json) {
    final map = <String, UpdateTeamRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UpdateTeamRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class UpdateTeamRequestFactory extends JsonSchemaFactory<UpdateTeamRequest> {
  const UpdateTeamRequestFactory();

  @override
  UpdateTeamRequest fromJson(dynamic json) => UpdateTeamRequest.fromJson(json as Map<String, dynamic>);
}



enum UpdateTeamRequestTypeEnum {
@JsonValue('SERVICE_LEVEL')
SERVICE_LEVEL('SERVICE_LEVEL'),
@JsonValue('QUESTION')
QUESTION('QUESTION');

const UpdateTeamRequestTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




