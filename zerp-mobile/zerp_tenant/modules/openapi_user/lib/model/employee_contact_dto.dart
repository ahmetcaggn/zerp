//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'employee_contact_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class EmployeeContactDTO extends Schema {
  /// Returns a new [EmployeeContactDTO] instance.
  EmployeeContactDTO({
    this.id,
    this.type,
    this.value,
    this.contactPersonName,
    this.relationship,
  });

  @JsonKey(name: r'id')
  final int? id;

  @JsonKey(name: r'type')
  final EmployeeContactDTOTypeEnum? type;

  @JsonKey(name: r'value')
  final String? value;

  @JsonKey(name: r'contactPersonName')
  final String? contactPersonName;

  @JsonKey(name: r'relationship')
  final String? relationship;

  /// The factory instance for creating [EmployeeContactDTO] from JSON.
  static const factory = EmployeeContactDTOFactory();

  factory EmployeeContactDTO.fromJson(Map<String, dynamic> json) => _$EmployeeContactDTOFromJson(json);

  Map<String, dynamic> toJson() => _$EmployeeContactDTOToJson(this);

  static List<EmployeeContactDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeContactDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeContactDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmployeeContactDTO> mapFromJson(dynamic json) {
    final map = <String, EmployeeContactDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmployeeContactDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class EmployeeContactDTOFactory extends JsonSchemaFactory<EmployeeContactDTO> {
  const EmployeeContactDTOFactory();

  @override
  EmployeeContactDTO fromJson(dynamic json) => EmployeeContactDTO.fromJson(json as Map<String, dynamic>);
}



enum EmployeeContactDTOTypeEnum {
@JsonValue('WORK_PHONE')
WORK_PHONE('WORK_PHONE'),
@JsonValue('PERSONAL_PHONE')
PERSONAL_PHONE('PERSONAL_PHONE'),
@JsonValue('WORK_EMAIL')
WORK_EMAIL('WORK_EMAIL'),
@JsonValue('PERSONAL_EMAIL')
PERSONAL_EMAIL('PERSONAL_EMAIL'),
@JsonValue('EMERGENCY_CONTACT')
EMERGENCY_CONTACT('EMERGENCY_CONTACT');

const EmployeeContactDTOTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




