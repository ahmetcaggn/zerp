//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'user_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UserResponseDTO extends Schema {
  /// Returns a new [UserResponseDTO] instance.
  UserResponseDTO({
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

  /// The factory instance for creating [UserResponseDTO] from JSON.
  static const factory = UserResponseDTOFactory();

  factory UserResponseDTO.fromJson(Map<String, dynamic> json) => _$UserResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$UserResponseDTOToJson(this);

  static List<UserResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UserResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UserResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UserResponseDTO> mapFromJson(dynamic json) {
    final map = <String, UserResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UserResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class UserResponseDTOFactory extends JsonSchemaFactory<UserResponseDTO> {
  const UserResponseDTOFactory();

  @override
  UserResponseDTO fromJson(dynamic json) => UserResponseDTO.fromJson(json as Map<String, dynamic>);
}




