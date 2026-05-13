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
class EmployeeContactDto extends Schema {
  /// Returns a new [EmployeeContactDto] instance.
  EmployeeContactDto({
    this.id,
    required this.type,
    required this.value,
    this.contactPersonName,
    this.relationship,
  });

  @JsonKey(name: r'id')
  final int? id;

  @JsonKey(name: r'type')
  final EmployeeContactDtoTypeEnum type;

  @JsonKey(name: r'value')
  final String value;

  @JsonKey(name: r'contactPersonName')
  final String? contactPersonName;

  @JsonKey(name: r'relationship')
  final String? relationship;

  /// The factory instance for creating [EmployeeContactDto] from JSON.
  static const factory = EmployeeContactDtoFactory();

  factory EmployeeContactDto.fromJson(Map<String, dynamic> json) => _$EmployeeContactDtoFromJson(json);

  Map<String, dynamic> toJson() => _$EmployeeContactDtoToJson(this);

  static List<EmployeeContactDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeContactDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeContactDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmployeeContactDto> mapFromJson(dynamic json) {
    final map = <String, EmployeeContactDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmployeeContactDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class EmployeeContactDtoFactory extends JsonSchemaFactory<EmployeeContactDto> {
  const EmployeeContactDtoFactory();

  @override
  EmployeeContactDto fromJson(dynamic json) => EmployeeContactDto.fromJson(json as Map<String, dynamic>);
}



enum EmployeeContactDtoTypeEnum {
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

const EmployeeContactDtoTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




