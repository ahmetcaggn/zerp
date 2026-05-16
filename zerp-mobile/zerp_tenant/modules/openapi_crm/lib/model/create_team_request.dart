//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'create_team_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateTeamRequest extends Schema {
  /// Returns a new [CreateTeamRequest] instance.
  CreateTeamRequest({
    this.name,
    this.description,
    this.type,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'type')
  final CreateTeamRequestTypeEnum? type;

  /// The factory instance for creating [CreateTeamRequest] from JSON.
  static const factory = CreateTeamRequestFactory();

  factory CreateTeamRequest.fromJson(Map<String, dynamic> json) => _$CreateTeamRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateTeamRequestToJson(this);

  static List<CreateTeamRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateTeamRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateTeamRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreateTeamRequest> mapFromJson(dynamic json) {
    final map = <String, CreateTeamRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreateTeamRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class CreateTeamRequestFactory extends JsonSchemaFactory<CreateTeamRequest> {
  const CreateTeamRequestFactory();

  @override
  CreateTeamRequest fromJson(dynamic json) => CreateTeamRequest.fromJson(json as Map<String, dynamic>);
}



enum CreateTeamRequestTypeEnum {
@JsonValue('SERVICE_LEVEL')
SERVICE_LEVEL('SERVICE_LEVEL'),
@JsonValue('QUESTION')
QUESTION('QUESTION');

const CreateTeamRequestTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




