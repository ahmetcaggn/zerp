//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'employee_contact_dto.dart';

class CreateEmployeeRequestDto extends Schema {
  /// Returns a new [CreateEmployeeRequestDto] instance.
  CreateEmployeeRequestDto({
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
  });

  final String username;

  final String tempPassword;

  final String firstName;

  final String lastName;

  final String email;

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

  final DateTime hireDate;

  final CreateEmployeeRequestDtoStatusEnum? status;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? managerId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? salary;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? isActive;

  final List<EmployeeContactDto> contacts;

  /// The factory instance for creating [CreateEmployeeRequestDto] from JSON.
  static const factory = CreateEmployeeRequestDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is CreateEmployeeRequestDto &&
    other.username == username &&
    other.tempPassword == tempPassword &&
    other.firstName == firstName &&
    other.lastName == lastName &&
    other.email == email &&
    other.phoneNumber == phoneNumber &&
    other.nationalId == nationalId &&
    other.dateOfBirth == dateOfBirth &&
    other.hireDate == hireDate &&
    other.status == status &&
    other.managerId == managerId &&
    other.salary == salary &&
    other.isActive == isActive &&
    other.contacts == contacts;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (username.hashCode) +
    (tempPassword.hashCode) +
    (firstName.hashCode) +
    (lastName.hashCode) +
    (email.hashCode) +
    (phoneNumber == null ? 0 : phoneNumber!.hashCode) +
    (nationalId == null ? 0 : nationalId!.hashCode) +
    (dateOfBirth == null ? 0 : dateOfBirth!.hashCode) +
    (hireDate.hashCode) +
    (status == null ? 0 : status!.hashCode) +
    (managerId == null ? 0 : managerId!.hashCode) +
    (salary == null ? 0 : salary!.hashCode) +
    (isActive == null ? 0 : isActive!.hashCode) +
    (contacts.hashCode);

  @override
  String toString() => 'CreateEmployeeRequestDto[username=$username, tempPassword=$tempPassword, firstName=$firstName, lastName=$lastName, email=$email, phoneNumber=$phoneNumber, nationalId=$nationalId, dateOfBirth=$dateOfBirth, hireDate=$hireDate, status=$status, managerId=$managerId, salary=$salary, isActive=$isActive, contacts=$contacts]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'username'] = this.username;
      json[r'tempPassword'] = this.tempPassword;
      json[r'firstName'] = this.firstName;
      json[r'lastName'] = this.lastName;
      json[r'email'] = this.email;
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
      json[r'hireDate'] = this.hireDate.toUtc().toIso8601String();
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
    if (this.isActive != null) {
      json[r'isActive'] = this.isActive;
    } else {
      json[r'isActive'] = null;
    }
      json[r'contacts'] = this.contacts;
    return json;
  }

  /// Returns a new [CreateEmployeeRequestDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CreateEmployeeRequestDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CreateEmployeeRequestDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CreateEmployeeRequestDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CreateEmployeeRequestDto(
        username: json[r'username'] as String,
        tempPassword: json[r'tempPassword'] as String,
        firstName: json[r'firstName'] as String,
        lastName: json[r'lastName'] as String,
        email: json[r'email'] as String,
        phoneNumber: json[r'phoneNumber'] is String ? json[r'phoneNumber'] as String : null,
        nationalId: json[r'nationalId'] is String ? json[r'nationalId'] as String : null,
        dateOfBirth: json[r'dateOfBirth'] != null ? DateTime.parse(json[r'dateOfBirth'].toString()) : null,
        hireDate: DateTime.parse(json[r'hireDate'].toString()),
        status: CreateEmployeeRequestDtoStatusEnum.fromJson(json[r'status']),
        managerId: json[r'managerId'] is String ? json[r'managerId'] as String : null,
        salary: num.parse('${json[r'salary']}'),
        isActive: json[r'isActive'] is bool ? json[r'isActive'] as bool : null,
        contacts: EmployeeContactDto.listFromJson(json[r'contacts']),
      );
    }
    return null;
  }

  static List<CreateEmployeeRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateEmployeeRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateEmployeeRequestDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreateEmployeeRequestDto> mapFromJson(dynamic json) {
    final map = <String, CreateEmployeeRequestDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreateEmployeeRequestDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CreateEmployeeRequestDto-objects as value to a dart map
  static Map<String, List<CreateEmployeeRequestDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CreateEmployeeRequestDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CreateEmployeeRequestDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'username',
    'tempPassword',
    'firstName',
    'lastName',
    'email',
    'hireDate',
  };
}

/// Factory for creating [CreateEmployeeRequestDto] instances from JSON data.
class CreateEmployeeRequestDtoFactory extends JsonSchemaFactory<CreateEmployeeRequestDto> {
  const CreateEmployeeRequestDtoFactory();

  @override
  CreateEmployeeRequestDto fromJson(dynamic json) => CreateEmployeeRequestDto.fromJson(json)!;
}


class CreateEmployeeRequestDtoStatusEnum {
  /// Instantiate a new enum with the provided [value].
  const CreateEmployeeRequestDtoStatusEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ACTIVE = CreateEmployeeRequestDtoStatusEnum._(r'ACTIVE');
  static const TERMINATED = CreateEmployeeRequestDtoStatusEnum._(r'TERMINATED');
  static const SUSPENDED = CreateEmployeeRequestDtoStatusEnum._(r'SUSPENDED');
  static const ON_LEAVE = CreateEmployeeRequestDtoStatusEnum._(r'ON_LEAVE');
  static const RETIRED = CreateEmployeeRequestDtoStatusEnum._(r'RETIRED');
  static const PROBATION = CreateEmployeeRequestDtoStatusEnum._(r'PROBATION');
  static const DELETED = CreateEmployeeRequestDtoStatusEnum._(r'DELETED');

  /// List of all possible values in this [enum][CreateEmployeeRequestDtoStatusEnum].
  static const values = <CreateEmployeeRequestDtoStatusEnum>[
    ACTIVE,
    TERMINATED,
    SUSPENDED,
    ON_LEAVE,
    RETIRED,
    PROBATION,
    DELETED,
  ];

  static CreateEmployeeRequestDtoStatusEnum? fromJson(dynamic value) => CreateEmployeeRequestDtoStatusEnumTypeTransformer().decode(value);

  static List<CreateEmployeeRequestDtoStatusEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateEmployeeRequestDtoStatusEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateEmployeeRequestDtoStatusEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [CreateEmployeeRequestDtoStatusEnum] to String,
/// and [decode] dynamic data back to [CreateEmployeeRequestDtoStatusEnum].
class CreateEmployeeRequestDtoStatusEnumTypeTransformer {
  factory CreateEmployeeRequestDtoStatusEnumTypeTransformer() => _instance ??= const CreateEmployeeRequestDtoStatusEnumTypeTransformer._();

  const CreateEmployeeRequestDtoStatusEnumTypeTransformer._();

  String encode(CreateEmployeeRequestDtoStatusEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a CreateEmployeeRequestDtoStatusEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  CreateEmployeeRequestDtoStatusEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ACTIVE': return CreateEmployeeRequestDtoStatusEnum.ACTIVE;
        case r'TERMINATED': return CreateEmployeeRequestDtoStatusEnum.TERMINATED;
        case r'SUSPENDED': return CreateEmployeeRequestDtoStatusEnum.SUSPENDED;
        case r'ON_LEAVE': return CreateEmployeeRequestDtoStatusEnum.ON_LEAVE;
        case r'RETIRED': return CreateEmployeeRequestDtoStatusEnum.RETIRED;
        case r'PROBATION': return CreateEmployeeRequestDtoStatusEnum.PROBATION;
        case r'DELETED': return CreateEmployeeRequestDtoStatusEnum.DELETED;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [CreateEmployeeRequestDtoStatusEnumTypeTransformer] instance.
  static CreateEmployeeRequestDtoStatusEnumTypeTransformer? _instance;
}


