//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'employee_contact_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class EmployeeContactResponseDto extends Schema {
  /// Returns a new [EmployeeContactResponseDto] instance.
  EmployeeContactResponseDto({
    this.id,
    this.type,
    this.value,
    this.contactPersonName,
    this.relationship,
  });

  @JsonKey(name: r'id')
  final int? id;

  @JsonKey(name: r'type')
  final EmployeeContactResponseDtoTypeEnum? type;

  @JsonKey(name: r'value')
  final String? value;

  @JsonKey(name: r'contactPersonName')
  final String? contactPersonName;

  @JsonKey(name: r'relationship')
  final String? relationship;

  /// The factory instance for creating [EmployeeContactResponseDto] from JSON.
  static const factory = EmployeeContactResponseDtoFactory();

  factory EmployeeContactResponseDto.fromJson(Map<String, dynamic> json) => _$EmployeeContactResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$EmployeeContactResponseDtoToJson(this);

  static List<EmployeeContactResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeContactResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeContactResponseDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmployeeContactResponseDto> mapFromJson(dynamic json) {
    final map = <String, EmployeeContactResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmployeeContactResponseDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class EmployeeContactResponseDtoFactory extends JsonSchemaFactory<EmployeeContactResponseDto> {
  const EmployeeContactResponseDtoFactory();

  @override
  EmployeeContactResponseDto fromJson(dynamic json) => EmployeeContactResponseDto.fromJson(json as Map<String, dynamic>);
}



enum EmployeeContactResponseDtoTypeEnum {
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

const EmployeeContactResponseDtoTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




