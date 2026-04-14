//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class EmployeeListResponseDto extends Schema {
  /// Returns a new [EmployeeListResponseDto] instance.
  EmployeeListResponseDto({
    this.id,
    this.firstName,
    this.lastName,
    this.email,
    this.phoneNumber,
    this.status,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? id;

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

  final EmployeeListResponseDtoStatusEnum? status;

  /// The factory instance for creating [EmployeeListResponseDto] from JSON.
  static const factory = EmployeeListResponseDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is EmployeeListResponseDto &&
    other.id == id &&
    other.firstName == firstName &&
    other.lastName == lastName &&
    other.email == email &&
    other.phoneNumber == phoneNumber &&
    other.status == status;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (firstName == null ? 0 : firstName!.hashCode) +
    (lastName == null ? 0 : lastName!.hashCode) +
    (email == null ? 0 : email!.hashCode) +
    (phoneNumber == null ? 0 : phoneNumber!.hashCode) +
    (status == null ? 0 : status!.hashCode);

  @override
  String toString() => 'EmployeeListResponseDto[id=$id, firstName=$firstName, lastName=$lastName, email=$email, phoneNumber=$phoneNumber, status=$status]';

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
    if (this.status != null) {
      json[r'status'] = this.status;
    } else {
      json[r'status'] = null;
    }
    return json;
  }

  /// Returns a new [EmployeeListResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static EmployeeListResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "EmployeeListResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "EmployeeListResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return EmployeeListResponseDto(
        id: json[r'id'] is int ? json[r'id'] as int : null,
        firstName: json[r'firstName'] is String ? json[r'firstName'] as String : null,
        lastName: json[r'lastName'] is String ? json[r'lastName'] as String : null,
        email: json[r'email'] is String ? json[r'email'] as String : null,
        phoneNumber: json[r'phoneNumber'] is String ? json[r'phoneNumber'] as String : null,
        status: EmployeeListResponseDtoStatusEnum.fromJson(json[r'status']),
      );
    }
    return null;
  }

  static List<EmployeeListResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeListResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeListResponseDto.fromJson(row);
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
        final value = EmployeeListResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of EmployeeListResponseDto-objects as value to a dart map
  static Map<String, List<EmployeeListResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<EmployeeListResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = EmployeeListResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [EmployeeListResponseDto] instances from JSON data.
class EmployeeListResponseDtoFactory extends JsonSchemaFactory<EmployeeListResponseDto> {
  const EmployeeListResponseDtoFactory();

  @override
  EmployeeListResponseDto fromJson(dynamic json) => EmployeeListResponseDto.fromJson(json)!;
}


class EmployeeListResponseDtoStatusEnum {
  /// Instantiate a new enum with the provided [value].
  const EmployeeListResponseDtoStatusEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ACTIVE = EmployeeListResponseDtoStatusEnum._(r'ACTIVE');
  static const TERMINATED = EmployeeListResponseDtoStatusEnum._(r'TERMINATED');
  static const SUSPENDED = EmployeeListResponseDtoStatusEnum._(r'SUSPENDED');
  static const ON_LEAVE = EmployeeListResponseDtoStatusEnum._(r'ON_LEAVE');
  static const RETIRED = EmployeeListResponseDtoStatusEnum._(r'RETIRED');
  static const PROBATION = EmployeeListResponseDtoStatusEnum._(r'PROBATION');

  /// List of all possible values in this [enum][EmployeeListResponseDtoStatusEnum].
  static const values = <EmployeeListResponseDtoStatusEnum>[
    ACTIVE,
    TERMINATED,
    SUSPENDED,
    ON_LEAVE,
    RETIRED,
    PROBATION,
  ];

  static EmployeeListResponseDtoStatusEnum? fromJson(dynamic value) => EmployeeListResponseDtoStatusEnumTypeTransformer().decode(value);

  static List<EmployeeListResponseDtoStatusEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeListResponseDtoStatusEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeListResponseDtoStatusEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [EmployeeListResponseDtoStatusEnum] to String,
/// and [decode] dynamic data back to [EmployeeListResponseDtoStatusEnum].
class EmployeeListResponseDtoStatusEnumTypeTransformer {
  factory EmployeeListResponseDtoStatusEnumTypeTransformer() => _instance ??= const EmployeeListResponseDtoStatusEnumTypeTransformer._();

  const EmployeeListResponseDtoStatusEnumTypeTransformer._();

  String encode(EmployeeListResponseDtoStatusEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a EmployeeListResponseDtoStatusEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  EmployeeListResponseDtoStatusEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ACTIVE': return EmployeeListResponseDtoStatusEnum.ACTIVE;
        case r'TERMINATED': return EmployeeListResponseDtoStatusEnum.TERMINATED;
        case r'SUSPENDED': return EmployeeListResponseDtoStatusEnum.SUSPENDED;
        case r'ON_LEAVE': return EmployeeListResponseDtoStatusEnum.ON_LEAVE;
        case r'RETIRED': return EmployeeListResponseDtoStatusEnum.RETIRED;
        case r'PROBATION': return EmployeeListResponseDtoStatusEnum.PROBATION;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [EmployeeListResponseDtoStatusEnumTypeTransformer] instance.
  static EmployeeListResponseDtoStatusEnumTypeTransformer? _instance;
}


