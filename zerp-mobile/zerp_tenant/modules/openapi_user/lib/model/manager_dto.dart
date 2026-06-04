//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'manager_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ManagerDTO extends Schema {
  /// Returns a new [ManagerDTO] instance.
  ManagerDTO({
    this.id,
    this.firstName,
    this.lastName,
    this.email,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'firstName')
  final String? firstName;

  @JsonKey(name: r'lastName')
  final String? lastName;

  @JsonKey(name: r'email')
  final String? email;

  /// The factory instance for creating [ManagerDTO] from JSON.
  static const factory = ManagerDTOFactory();

  factory ManagerDTO.fromJson(Map<String, dynamic> json) => _$ManagerDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ManagerDTOToJson(this);

  static List<ManagerDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ManagerDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ManagerDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ManagerDTO> mapFromJson(dynamic json) {
    final map = <String, ManagerDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ManagerDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ManagerDTOFactory extends JsonSchemaFactory<ManagerDTO> {
  const ManagerDTOFactory();

  @override
  ManagerDTO fromJson(dynamic json) => ManagerDTO.fromJson(json as Map<String, dynamic>);
}




