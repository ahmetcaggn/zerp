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


part 'admin_create_employee_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AdminCreateEmployeeRequestDto extends Schema {
  /// Returns a new [AdminCreateEmployeeRequestDto] instance.
  AdminCreateEmployeeRequestDto({
    required this.username,
    required this.tempPassword,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phoneNumber,
    this.nationalId,
    this.dateOfBirth,
    required this.hireDate,
    this.status,
    this.managerId,
    this.salary,
    this.isActive,
    this.contacts = const [],
    this.tenantId,
  });

  @JsonKey(name: r'username')
  final String username;

  @JsonKey(name: r'tempPassword')
  final String tempPassword;

  @JsonKey(name: r'firstName')
  final String firstName;

  @JsonKey(name: r'lastName')
  final String lastName;

  @JsonKey(name: r'email')
  final String email;

  @JsonKey(name: r'phoneNumber')
  final String? phoneNumber;

  @JsonKey(name: r'nationalId')
  final String? nationalId;

  @JsonKey(name: r'dateOfBirth')
  final DateTime? dateOfBirth;

  @JsonKey(name: r'hireDate')
  final DateTime hireDate;

  @JsonKey(name: r'status')
  final AdminCreateEmployeeRequestDtoStatusEnum? status;

  @JsonKey(name: r'managerId')
  final String? managerId;

  @JsonKey(name: r'salary')
  final num? salary;

  @JsonKey(name: r'isActive')
  final bool? isActive;

  @JsonKey(name: r'contacts')
  final List<EmployeeContactDto> contacts;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [AdminCreateEmployeeRequestDto] from JSON.
  static const factory = AdminCreateEmployeeRequestDtoFactory();

  factory AdminCreateEmployeeRequestDto.fromJson(Map<String, dynamic> json) => _$AdminCreateEmployeeRequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$AdminCreateEmployeeRequestDtoToJson(this);

  static List<AdminCreateEmployeeRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AdminCreateEmployeeRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AdminCreateEmployeeRequestDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AdminCreateEmployeeRequestDto> mapFromJson(dynamic json) {
    final map = <String, AdminCreateEmployeeRequestDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AdminCreateEmployeeRequestDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AdminCreateEmployeeRequestDtoFactory extends JsonSchemaFactory<AdminCreateEmployeeRequestDto> {
  const AdminCreateEmployeeRequestDtoFactory();

  @override
  AdminCreateEmployeeRequestDto fromJson(dynamic json) => AdminCreateEmployeeRequestDto.fromJson(json as Map<String, dynamic>);
}



enum AdminCreateEmployeeRequestDtoStatusEnum {
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

const AdminCreateEmployeeRequestDtoStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




