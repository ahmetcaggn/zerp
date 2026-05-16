//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'employee_contact_dto.dart';


part 'update_employee_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateEmployeeRequestDto extends Schema {
  /// Returns a new [UpdateEmployeeRequestDto] instance.
  UpdateEmployeeRequestDto({
    this.username,
    this.firstName,
    this.lastName,
    this.email,
    this.phoneNumber,
    this.nationalId,
    this.dateOfBirth,
    this.hireDate,
    this.terminationDate,
    this.status,
    this.managerId,
    this.salary,
    this.contacts = const [],
  });

  @JsonKey(name: r'username')
  final String? username;

  @JsonKey(name: r'firstName')
  final String? firstName;

  @JsonKey(name: r'lastName')
  final String? lastName;

  @JsonKey(name: r'email')
  final String? email;

  @JsonKey(name: r'phoneNumber')
  final String? phoneNumber;

  @JsonKey(name: r'nationalId')
  final String? nationalId;

  @JsonKey(name: r'dateOfBirth')
  final DateTime? dateOfBirth;

  @JsonKey(name: r'hireDate')
  final DateTime? hireDate;

  @JsonKey(name: r'terminationDate')
  final DateTime? terminationDate;

  @JsonKey(name: r'status')
  final UpdateEmployeeRequestDtoStatusEnum? status;

  @JsonKey(name: r'managerId')
  final String? managerId;

  @JsonKey(name: r'salary')
  final num? salary;

  @JsonKey(name: r'contacts')
  final List<EmployeeContactDto> contacts;

  /// The factory instance for creating [UpdateEmployeeRequestDto] from JSON.
  static const factory = UpdateEmployeeRequestDtoFactory();

  factory UpdateEmployeeRequestDto.fromJson(Map<String, dynamic> json) => _$UpdateEmployeeRequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateEmployeeRequestDtoToJson(this);

  static List<UpdateEmployeeRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UpdateEmployeeRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateEmployeeRequestDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UpdateEmployeeRequestDto> mapFromJson(dynamic json) {
    final map = <String, UpdateEmployeeRequestDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UpdateEmployeeRequestDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class UpdateEmployeeRequestDtoFactory extends JsonSchemaFactory<UpdateEmployeeRequestDto> {
  const UpdateEmployeeRequestDtoFactory();

  @override
  UpdateEmployeeRequestDto fromJson(dynamic json) => UpdateEmployeeRequestDto.fromJson(json as Map<String, dynamic>);
}



enum UpdateEmployeeRequestDtoStatusEnum {
@JsonValue('ACTIVE')
ACTIVE('ACTIVE'),
@JsonValue('TERMINATED')
TERMINATED('TERMINATED'),
@JsonValue('SUSPENDED')
SUSPENDED('SUSPENDED'),
@JsonValue('ON_LEAVE')
ON_LEAVE('ON_LEAVE'),
@JsonValue('RETIRED')
RETIRED('RETIRED'),
@JsonValue('PROBATION')
PROBATION('PROBATION'),
@JsonValue('DELETED')
DELETED('DELETED');

const UpdateEmployeeRequestDtoStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




