//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'user_create_if_not_exist_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UserCreateIfNotExistRequestDTO extends Schema {
  /// Returns a new [UserCreateIfNotExistRequestDTO] instance.
  UserCreateIfNotExistRequestDTO({
    this.id,
    this.username,
    this.email,
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'username')
  final String? username;

  @JsonKey(name: r'email')
  final String? email;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [UserCreateIfNotExistRequestDTO] from JSON.
  static const factory = UserCreateIfNotExistRequestDTOFactory();

  factory UserCreateIfNotExistRequestDTO.fromJson(Map<String, dynamic> json) => _$UserCreateIfNotExistRequestDTOFromJson(json);

  Map<String, dynamic> toJson() => _$UserCreateIfNotExistRequestDTOToJson(this);

  static List<UserCreateIfNotExistRequestDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UserCreateIfNotExistRequestDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UserCreateIfNotExistRequestDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UserCreateIfNotExistRequestDTO> mapFromJson(dynamic json) {
    final map = <String, UserCreateIfNotExistRequestDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UserCreateIfNotExistRequestDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class UserCreateIfNotExistRequestDTOFactory extends JsonSchemaFactory<UserCreateIfNotExistRequestDTO> {
  const UserCreateIfNotExistRequestDTOFactory();

  @override
  UserCreateIfNotExistRequestDTO fromJson(dynamic json) => UserCreateIfNotExistRequestDTO.fromJson(json as Map<String, dynamic>);
}




