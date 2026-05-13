//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'user_check_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UserCheckResponseDTO extends Schema {
  /// Returns a new [UserCheckResponseDTO] instance.
  UserCheckResponseDTO({
    this.valid,
  });

  @JsonKey(name: r'valid')
  final bool? valid;

  /// The factory instance for creating [UserCheckResponseDTO] from JSON.
  static const factory = UserCheckResponseDTOFactory();

  factory UserCheckResponseDTO.fromJson(Map<String, dynamic> json) => _$UserCheckResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$UserCheckResponseDTOToJson(this);

  static List<UserCheckResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UserCheckResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UserCheckResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UserCheckResponseDTO> mapFromJson(dynamic json) {
    final map = <String, UserCheckResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UserCheckResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class UserCheckResponseDTOFactory extends JsonSchemaFactory<UserCheckResponseDTO> {
  const UserCheckResponseDTOFactory();

  @override
  UserCheckResponseDTO fromJson(dynamic json) => UserCheckResponseDTO.fromJson(json as Map<String, dynamic>);
}




