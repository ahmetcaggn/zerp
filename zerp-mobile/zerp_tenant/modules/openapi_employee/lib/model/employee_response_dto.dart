//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'employee_contact_response_dto.dart';
import 'manager_dto.dart';


part 'employee_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class EmployeeResponseDto extends Schema {
  /// Returns a new [EmployeeResponseDto] instance.
  EmployeeResponseDto({
    this.id,
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
    this.manager,
    this.salary,
    this.contacts = const [],
    this.createdAt,
    this.updatedAt,
  });

  @JsonKey(name: r'id')
  final String? id;

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
  final EmployeeResponseDtoStatusEnum? status;

  @JsonKey(name: r'manager')
  final ManagerDto? manager;

  @JsonKey(name: r'salary')
  final num? salary;

  @JsonKey(name: r'contacts')
  final List<EmployeeContactResponseDto> contacts;

  @JsonKey(name: r'createdAt')
  final DateTime? createdAt;

  @JsonKey(name: r'updatedAt')
  final DateTime? updatedAt;

  /// The factory instance for creating [EmployeeResponseDto] from JSON.
  static const factory = EmployeeResponseDtoFactory();

  factory EmployeeResponseDto.fromJson(Map<String, dynamic> json) => _$EmployeeResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$EmployeeResponseDtoToJson(this);

  static List<EmployeeResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeResponseDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmployeeResponseDto> mapFromJson(dynamic json) {
    final map = <String, EmployeeResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmployeeResponseDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class EmployeeResponseDtoFactory extends JsonSchemaFactory<EmployeeResponseDto> {
  const EmployeeResponseDtoFactory();

  @override
  EmployeeResponseDto fromJson(dynamic json) => EmployeeResponseDto.fromJson(json as Map<String, dynamic>);
}



enum EmployeeResponseDtoStatusEnum {
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

const EmployeeResponseDtoStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




