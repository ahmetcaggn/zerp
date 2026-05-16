//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'username_check_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UsernameCheckResponseDTO extends Schema {
  /// Returns a new [UsernameCheckResponseDTO] instance.
  UsernameCheckResponseDTO({
    this.username,
    this.available,
  });

  @JsonKey(name: r'username')
  final String? username;

  @JsonKey(name: r'available')
  final bool? available;

  /// The factory instance for creating [UsernameCheckResponseDTO] from JSON.
  static const factory = UsernameCheckResponseDTOFactory();

  factory UsernameCheckResponseDTO.fromJson(Map<String, dynamic> json) => _$UsernameCheckResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$UsernameCheckResponseDTOToJson(this);

  static List<UsernameCheckResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UsernameCheckResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UsernameCheckResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UsernameCheckResponseDTO> mapFromJson(dynamic json) {
    final map = <String, UsernameCheckResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UsernameCheckResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class UsernameCheckResponseDTOFactory extends JsonSchemaFactory<UsernameCheckResponseDTO> {
  const UsernameCheckResponseDTOFactory();

  @override
  UsernameCheckResponseDTO fromJson(dynamic json) => UsernameCheckResponseDTO.fromJson(json as Map<String, dynamic>);
}




