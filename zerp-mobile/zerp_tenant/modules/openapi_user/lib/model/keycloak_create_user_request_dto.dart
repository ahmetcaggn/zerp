//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'keycloak_create_user_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class KeycloakCreateUserRequestDTO extends Schema {
  /// Returns a new [KeycloakCreateUserRequestDTO] instance.
  KeycloakCreateUserRequestDTO({
    required this.username,
    required this.email,
    this.tempPassword,
    required this.tenantId,
  });

  @JsonKey(name: r'username')
  final String username;

  @JsonKey(name: r'email')
  final String email;

  @JsonKey(name: r'tempPassword')
  final String? tempPassword;

  @JsonKey(name: r'tenantId')
  final String tenantId;

  /// The factory instance for creating [KeycloakCreateUserRequestDTO] from JSON.
  static const factory = KeycloakCreateUserRequestDTOFactory();

  factory KeycloakCreateUserRequestDTO.fromJson(Map<String, dynamic> json) => _$KeycloakCreateUserRequestDTOFromJson(json);

  Map<String, dynamic> toJson() => _$KeycloakCreateUserRequestDTOToJson(this);

  static List<KeycloakCreateUserRequestDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <KeycloakCreateUserRequestDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = KeycloakCreateUserRequestDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, KeycloakCreateUserRequestDTO> mapFromJson(dynamic json) {
    final map = <String, KeycloakCreateUserRequestDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = KeycloakCreateUserRequestDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class KeycloakCreateUserRequestDTOFactory extends JsonSchemaFactory<KeycloakCreateUserRequestDTO> {
  const KeycloakCreateUserRequestDTOFactory();

  @override
  KeycloakCreateUserRequestDTO fromJson(dynamic json) => KeycloakCreateUserRequestDTO.fromJson(json as Map<String, dynamic>);
}




