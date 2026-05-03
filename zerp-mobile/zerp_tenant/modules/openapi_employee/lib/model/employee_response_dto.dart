//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'employee_contact_response_dto.dart';
import 'manager_dto.dart';

class EmployeeResponseDto extends Schema {
  /// Returns a new [EmployeeResponseDto] instance.
  EmployeeResponseDto({
    this.id,
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

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? id;

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

  final EmployeeResponseDtoStatusEnum? status;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final ManagerDto? manager;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? salary;

  final List<EmployeeContactResponseDto> contacts;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? createdAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? updatedAt;

  /// The factory instance for creating [EmployeeResponseDto] from JSON.
  static const factory = EmployeeResponseDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is EmployeeResponseDto &&
    other.id == id &&
    other.firstName == firstName &&
    other.lastName == lastName &&
    other.email == email &&
    other.phoneNumber == phoneNumber &&
    other.nationalId == nationalId &&
    other.dateOfBirth == dateOfBirth &&
    other.hireDate == hireDate &&
    other.terminationDate == terminationDate &&
    other.status == status &&
    other.manager == manager &&
    other.salary == salary &&
    other.contacts == contacts &&
    other.createdAt == createdAt &&
    other.updatedAt == updatedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (firstName == null ? 0 : firstName!.hashCode) +
    (lastName == null ? 0 : lastName!.hashCode) +
    (email == null ? 0 : email!.hashCode) +
    (phoneNumber == null ? 0 : phoneNumber!.hashCode) +
    (nationalId == null ? 0 : nationalId!.hashCode) +
    (dateOfBirth == null ? 0 : dateOfBirth!.hashCode) +
    (hireDate == null ? 0 : hireDate!.hashCode) +
    (terminationDate == null ? 0 : terminationDate!.hashCode) +
    (status == null ? 0 : status!.hashCode) +
    (manager == null ? 0 : manager!.hashCode) +
    (salary == null ? 0 : salary!.hashCode) +
    (contacts.hashCode) +
    (createdAt == null ? 0 : createdAt!.hashCode) +
    (updatedAt == null ? 0 : updatedAt!.hashCode);

  @override
  String toString() => 'EmployeeResponseDto[id=$id, firstName=$firstName, lastName=$lastName, email=$email, phoneNumber=$phoneNumber, nationalId=$nationalId, dateOfBirth=$dateOfBirth, hireDate=$hireDate, terminationDate=$terminationDate, status=$status, manager=$manager, salary=$salary, contacts=$contacts, createdAt=$createdAt, updatedAt=$updatedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
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
    if (this.manager != null) {
      json[r'manager'] = this.manager;
    } else {
      json[r'manager'] = null;
    }
    if (this.salary != null) {
      json[r'salary'] = this.salary;
    } else {
      json[r'salary'] = null;
    }
      json[r'contacts'] = this.contacts;
    if (this.createdAt != null) {
      json[r'createdAt'] = this.createdAt!.toUtc().toIso8601String();
    } else {
      json[r'createdAt'] = null;
    }
    if (this.updatedAt != null) {
      json[r'updatedAt'] = this.updatedAt!.toUtc().toIso8601String();
    } else {
      json[r'updatedAt'] = null;
    }
    return json;
  }

  /// Returns a new [EmployeeResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static EmployeeResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "EmployeeResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "EmployeeResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return EmployeeResponseDto(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        firstName: json[r'firstName'] is String ? json[r'firstName'] as String : null,
        lastName: json[r'lastName'] is String ? json[r'lastName'] as String : null,
        email: json[r'email'] is String ? json[r'email'] as String : null,
        phoneNumber: json[r'phoneNumber'] is String ? json[r'phoneNumber'] as String : null,
        nationalId: json[r'nationalId'] is String ? json[r'nationalId'] as String : null,
        dateOfBirth: json[r'dateOfBirth'] != null ? DateTime.parse(json[r'dateOfBirth'].toString()) : null,
        hireDate: json[r'hireDate'] != null ? DateTime.parse(json[r'hireDate'].toString()) : null,
        terminationDate: json[r'terminationDate'] != null ? DateTime.parse(json[r'terminationDate'].toString()) : null,
        status: EmployeeResponseDtoStatusEnum.fromJson(json[r'status']),
        manager: ManagerDto.fromJson(json[r'manager']),
        salary: num.parse('${json[r'salary']}'),
        contacts: EmployeeContactResponseDto.listFromJson(json[r'contacts']),
        createdAt: json[r'createdAt'] != null ? DateTime.parse(json[r'createdAt'].toString()) : null,
        updatedAt: json[r'updatedAt'] != null ? DateTime.parse(json[r'updatedAt'].toString()) : null,
      );
    }
    return null;
  }

  static List<EmployeeResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeResponseDto.fromJson(row);
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
        final value = EmployeeResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of EmployeeResponseDto-objects as value to a dart map
  static Map<String, List<EmployeeResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<EmployeeResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = EmployeeResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [EmployeeResponseDto] instances from JSON data.
class EmployeeResponseDtoFactory extends JsonSchemaFactory<EmployeeResponseDto> {
  const EmployeeResponseDtoFactory();

  @override
  EmployeeResponseDto fromJson(dynamic json) => EmployeeResponseDto.fromJson(json)!;
}


class EmployeeResponseDtoStatusEnum {
  /// Instantiate a new enum with the provided [value].
  const EmployeeResponseDtoStatusEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ACTIVE = EmployeeResponseDtoStatusEnum._(r'ACTIVE');
  static const TERMINATED = EmployeeResponseDtoStatusEnum._(r'TERMINATED');
  static const SUSPENDED = EmployeeResponseDtoStatusEnum._(r'SUSPENDED');
  static const ON_LEAVE = EmployeeResponseDtoStatusEnum._(r'ON_LEAVE');
  static const RETIRED = EmployeeResponseDtoStatusEnum._(r'RETIRED');
  static const PROBATION = EmployeeResponseDtoStatusEnum._(r'PROBATION');
  static const DELETED = EmployeeResponseDtoStatusEnum._(r'DELETED');

  /// List of all possible values in this [enum][EmployeeResponseDtoStatusEnum].
  static const values = <EmployeeResponseDtoStatusEnum>[
    ACTIVE,
    TERMINATED,
    SUSPENDED,
    ON_LEAVE,
    RETIRED,
    PROBATION,
    DELETED,
  ];

  static EmployeeResponseDtoStatusEnum? fromJson(dynamic value) => EmployeeResponseDtoStatusEnumTypeTransformer().decode(value);

  static List<EmployeeResponseDtoStatusEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeResponseDtoStatusEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeResponseDtoStatusEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [EmployeeResponseDtoStatusEnum] to String,
/// and [decode] dynamic data back to [EmployeeResponseDtoStatusEnum].
class EmployeeResponseDtoStatusEnumTypeTransformer {
  factory EmployeeResponseDtoStatusEnumTypeTransformer() => _instance ??= const EmployeeResponseDtoStatusEnumTypeTransformer._();

  const EmployeeResponseDtoStatusEnumTypeTransformer._();

  String encode(EmployeeResponseDtoStatusEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a EmployeeResponseDtoStatusEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  EmployeeResponseDtoStatusEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ACTIVE': return EmployeeResponseDtoStatusEnum.ACTIVE;
        case r'TERMINATED': return EmployeeResponseDtoStatusEnum.TERMINATED;
        case r'SUSPENDED': return EmployeeResponseDtoStatusEnum.SUSPENDED;
        case r'ON_LEAVE': return EmployeeResponseDtoStatusEnum.ON_LEAVE;
        case r'RETIRED': return EmployeeResponseDtoStatusEnum.RETIRED;
        case r'PROBATION': return EmployeeResponseDtoStatusEnum.PROBATION;
        case r'DELETED': return EmployeeResponseDtoStatusEnum.DELETED;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [EmployeeResponseDtoStatusEnumTypeTransformer] instance.
  static EmployeeResponseDtoStatusEnumTypeTransformer? _instance;
}


