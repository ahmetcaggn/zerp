//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'employee_contact_dto.dart';

class UpdateEmployeeRequestDto extends Schema {
  /// Returns a new [UpdateEmployeeRequestDto] instance.
  UpdateEmployeeRequestDto({
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

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? firstName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? lastName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? email;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? phoneNumber;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? nationalId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? dateOfBirth;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? hireDate;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? terminationDate;

  final UpdateEmployeeRequestDtoStatusEnum? status;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? managerId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? salary;

  final List<EmployeeContactDto> contacts;

  /// The factory instance for creating [UpdateEmployeeRequestDto] from JSON.
  static const factory = UpdateEmployeeRequestDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is UpdateEmployeeRequestDto &&
    other.firstName == firstName &&
    other.lastName == lastName &&
    other.email == email &&
    other.phoneNumber == phoneNumber &&
    other.nationalId == nationalId &&
    other.dateOfBirth == dateOfBirth &&
    other.hireDate == hireDate &&
    other.terminationDate == terminationDate &&
    other.status == status &&
    other.managerId == managerId &&
    other.salary == salary &&
    other.contacts == contacts;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (firstName == null ? 0 : firstName!.hashCode) +
    (lastName == null ? 0 : lastName!.hashCode) +
    (email == null ? 0 : email!.hashCode) +
    (phoneNumber == null ? 0 : phoneNumber!.hashCode) +
    (nationalId == null ? 0 : nationalId!.hashCode) +
    (dateOfBirth == null ? 0 : dateOfBirth!.hashCode) +
    (hireDate == null ? 0 : hireDate!.hashCode) +
    (terminationDate == null ? 0 : terminationDate!.hashCode) +
    (status == null ? 0 : status!.hashCode) +
    (managerId == null ? 0 : managerId!.hashCode) +
    (salary == null ? 0 : salary!.hashCode) +
    (contacts.hashCode);

  @override
  String toString() => 'UpdateEmployeeRequestDto[firstName=$firstName, lastName=$lastName, email=$email, phoneNumber=$phoneNumber, nationalId=$nationalId, dateOfBirth=$dateOfBirth, hireDate=$hireDate, terminationDate=$terminationDate, status=$status, managerId=$managerId, salary=$salary, contacts=$contacts]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.firstName != null) {
      json[r'firstName'] = this.firstName;
    } else {
      json[r'firstName'] = null;
    }
    if (this.lastName != null) {
      json[r'lastName'] = this.lastName;
    } else {
      json[r'lastName'] = null;
    }
    if (this.email != null) {
      json[r'email'] = this.email;
    } else {
      json[r'email'] = null;
    }
    if (this.phoneNumber != null) {
      json[r'phoneNumber'] = this.phoneNumber;
    } else {
      json[r'phoneNumber'] = null;
    }
    if (this.nationalId != null) {
      json[r'nationalId'] = this.nationalId;
    } else {
      json[r'nationalId'] = null;
    }
    if (this.dateOfBirth != null) {
      json[r'dateOfBirth'] = this.dateOfBirth!.toUtc().toIso8601String();
    } else {
      json[r'dateOfBirth'] = null;
    }
    if (this.hireDate != null) {
      json[r'hireDate'] = this.hireDate!.toUtc().toIso8601String();
    } else {
      json[r'hireDate'] = null;
    }
    if (this.terminationDate != null) {
      json[r'terminationDate'] = this.terminationDate!.toUtc().toIso8601String();
    } else {
      json[r'terminationDate'] = null;
    }
    if (this.status != null) {
      json[r'status'] = this.status;
    } else {
      json[r'status'] = null;
    }
    if (this.managerId != null) {
      json[r'managerId'] = this.managerId;
    } else {
      json[r'managerId'] = null;
    }
    if (this.salary != null) {
      json[r'salary'] = this.salary;
    } else {
      json[r'salary'] = null;
    }
      json[r'contacts'] = this.contacts;
    return json;
  }

  /// Returns a new [UpdateEmployeeRequestDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UpdateEmployeeRequestDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "UpdateEmployeeRequestDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "UpdateEmployeeRequestDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UpdateEmployeeRequestDto(
        firstName: json[r'firstName'] is String ? json[r'firstName'] as String : null,
        lastName: json[r'lastName'] is String ? json[r'lastName'] as String : null,
        email: json[r'email'] is String ? json[r'email'] as String : null,
        phoneNumber: json[r'phoneNumber'] is String ? json[r'phoneNumber'] as String : null,
        nationalId: json[r'nationalId'] is String ? json[r'nationalId'] as String : null,
        dateOfBirth: json[r'dateOfBirth'] != null ? DateTime.parse(json[r'dateOfBirth'].toString()) : null,
        hireDate: json[r'hireDate'] != null ? DateTime.parse(json[r'hireDate'].toString()) : null,
        terminationDate: json[r'terminationDate'] != null ? DateTime.parse(json[r'terminationDate'].toString()) : null,
        status: UpdateEmployeeRequestDtoStatusEnum.fromJson(json[r'status']),
        managerId: json[r'managerId'] is int ? json[r'managerId'] as int : null,
        salary: num.parse('${json[r'salary']}'),
        contacts: EmployeeContactDto.listFromJson(json[r'contacts']),
      );
    }
    return null;
  }

  static List<UpdateEmployeeRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UpdateEmployeeRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateEmployeeRequestDto.fromJson(row);
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
        final value = UpdateEmployeeRequestDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UpdateEmployeeRequestDto-objects as value to a dart map
  static Map<String, List<UpdateEmployeeRequestDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<UpdateEmployeeRequestDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UpdateEmployeeRequestDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [UpdateEmployeeRequestDto] instances from JSON data.
class UpdateEmployeeRequestDtoFactory extends JsonSchemaFactory<UpdateEmployeeRequestDto> {
  const UpdateEmployeeRequestDtoFactory();

  @override
  UpdateEmployeeRequestDto fromJson(dynamic json) => UpdateEmployeeRequestDto.fromJson(json)!;
}


class UpdateEmployeeRequestDtoStatusEnum {
  /// Instantiate a new enum with the provided [value].
  const UpdateEmployeeRequestDtoStatusEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ACTIVE = UpdateEmployeeRequestDtoStatusEnum._(r'ACTIVE');
  static const TERMINATED = UpdateEmployeeRequestDtoStatusEnum._(r'TERMINATED');
  static const SUSPENDED = UpdateEmployeeRequestDtoStatusEnum._(r'SUSPENDED');
  static const ON_LEAVE = UpdateEmployeeRequestDtoStatusEnum._(r'ON_LEAVE');
  static const RETIRED = UpdateEmployeeRequestDtoStatusEnum._(r'RETIRED');
  static const PROBATION = UpdateEmployeeRequestDtoStatusEnum._(r'PROBATION');

  /// List of all possible values in this [enum][UpdateEmployeeRequestDtoStatusEnum].
  static const values = <UpdateEmployeeRequestDtoStatusEnum>[
    ACTIVE,
    TERMINATED,
    SUSPENDED,
    ON_LEAVE,
    RETIRED,
    PROBATION,
  ];

  static UpdateEmployeeRequestDtoStatusEnum? fromJson(dynamic value) => UpdateEmployeeRequestDtoStatusEnumTypeTransformer().decode(value);

  static List<UpdateEmployeeRequestDtoStatusEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UpdateEmployeeRequestDtoStatusEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateEmployeeRequestDtoStatusEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [UpdateEmployeeRequestDtoStatusEnum] to String,
/// and [decode] dynamic data back to [UpdateEmployeeRequestDtoStatusEnum].
class UpdateEmployeeRequestDtoStatusEnumTypeTransformer {
  factory UpdateEmployeeRequestDtoStatusEnumTypeTransformer() => _instance ??= const UpdateEmployeeRequestDtoStatusEnumTypeTransformer._();

  const UpdateEmployeeRequestDtoStatusEnumTypeTransformer._();

  String encode(UpdateEmployeeRequestDtoStatusEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a UpdateEmployeeRequestDtoStatusEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  UpdateEmployeeRequestDtoStatusEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ACTIVE': return UpdateEmployeeRequestDtoStatusEnum.ACTIVE;
        case r'TERMINATED': return UpdateEmployeeRequestDtoStatusEnum.TERMINATED;
        case r'SUSPENDED': return UpdateEmployeeRequestDtoStatusEnum.SUSPENDED;
        case r'ON_LEAVE': return UpdateEmployeeRequestDtoStatusEnum.ON_LEAVE;
        case r'RETIRED': return UpdateEmployeeRequestDtoStatusEnum.RETIRED;
        case r'PROBATION': return UpdateEmployeeRequestDtoStatusEnum.PROBATION;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [UpdateEmployeeRequestDtoStatusEnumTypeTransformer] instance.
  static UpdateEmployeeRequestDtoStatusEnumTypeTransformer? _instance;
}


