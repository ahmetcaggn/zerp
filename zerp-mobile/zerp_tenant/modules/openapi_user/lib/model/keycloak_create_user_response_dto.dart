//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'keycloak_create_user_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class KeycloakCreateUserResponseDTO extends Schema {
  /// Returns a new [KeycloakCreateUserResponseDTO] instance.
  KeycloakCreateUserResponseDTO({
    this.userId,
  });

  @JsonKey(name: r'userId')
  final String? userId;

  /// The factory instance for creating [KeycloakCreateUserResponseDTO] from JSON.
  static const factory = KeycloakCreateUserResponseDTOFactory();

  factory KeycloakCreateUserResponseDTO.fromJson(Map<String, dynamic> json) => _$KeycloakCreateUserResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$KeycloakCreateUserResponseDTOToJson(this);

  static List<KeycloakCreateUserResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <KeycloakCreateUserResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = KeycloakCreateUserResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, KeycloakCreateUserResponseDTO> mapFromJson(dynamic json) {
    final map = <String, KeycloakCreateUserResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = KeycloakCreateUserResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class KeycloakCreateUserResponseDTOFactory extends JsonSchemaFactory<KeycloakCreateUserResponseDTO> {
  const KeycloakCreateUserResponseDTOFactory();

  @override
  KeycloakCreateUserResponseDTO fromJson(dynamic json) => KeycloakCreateUserResponseDTO.fromJson(json as Map<String, dynamic>);
}




