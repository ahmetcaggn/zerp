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
import 'manager_dto.dart';


part 'current_user_profile_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CurrentUserProfileDTO extends Schema {
  /// Returns a new [CurrentUserProfileDTO] instance.
  CurrentUserProfileDTO({
    this.id,
    this.username,
    this.firstName,
    this.lastName,
    this.email,
    this.phoneNumber,
    this.nationalId,
    this.dateOfBirth,
    this.status,
    this.manager,
    this.contacts = const [],
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

  @JsonKey(name: r'status')
  final CurrentUserProfileDTOStatusEnum? status;

  @JsonKey(name: r'manager')
  final ManagerDTO? manager;

  @JsonKey(name: r'contacts')
  final List<EmployeeContactDTO> contacts;

  /// The factory instance for creating [CurrentUserProfileDTO] from JSON.
  static const factory = CurrentUserProfileDTOFactory();

  factory CurrentUserProfileDTO.fromJson(Map<String, dynamic> json) => _$CurrentUserProfileDTOFromJson(json);

  Map<String, dynamic> toJson() => _$CurrentUserProfileDTOToJson(this);

  static List<CurrentUserProfileDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CurrentUserProfileDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CurrentUserProfileDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CurrentUserProfileDTO> mapFromJson(dynamic json) {
    final map = <String, CurrentUserProfileDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CurrentUserProfileDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class CurrentUserProfileDTOFactory extends JsonSchemaFactory<CurrentUserProfileDTO> {
  const CurrentUserProfileDTOFactory();

  @override
  CurrentUserProfileDTO fromJson(dynamic json) => CurrentUserProfileDTO.fromJson(json as Map<String, dynamic>);
}



enum CurrentUserProfileDTOStatusEnum {
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

const CurrentUserProfileDTOStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




