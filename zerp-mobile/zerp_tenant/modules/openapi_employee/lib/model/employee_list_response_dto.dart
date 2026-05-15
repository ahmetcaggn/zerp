//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'employee_list_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class EmployeeListResponseDto extends Schema {
  /// Returns a new [EmployeeListResponseDto] instance.
  EmployeeListResponseDto({
    this.id,
    this.username,
    this.firstName,
    this.lastName,
    this.email,
    this.phoneNumber,
    this.status,
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

  @JsonKey(name: r'status')
  final EmployeeListResponseDtoStatusEnum? status;

  /// The factory instance for creating [EmployeeListResponseDto] from JSON.
  static const factory = EmployeeListResponseDtoFactory();

  factory EmployeeListResponseDto.fromJson(Map<String, dynamic> json) => _$EmployeeListResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$EmployeeListResponseDtoToJson(this);

  static List<EmployeeListResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeListResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeListResponseDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmployeeListResponseDto> mapFromJson(dynamic json) {
    final map = <String, EmployeeListResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmployeeListResponseDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class EmployeeListResponseDtoFactory extends JsonSchemaFactory<EmployeeListResponseDto> {
  const EmployeeListResponseDtoFactory();

  @override
  EmployeeListResponseDto fromJson(dynamic json) => EmployeeListResponseDto.fromJson(json as Map<String, dynamic>);
}



enum EmployeeListResponseDtoStatusEnum {
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

const EmployeeListResponseDtoStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




