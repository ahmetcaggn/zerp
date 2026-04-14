//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class EmployeeContactResponseDto extends Schema {
  /// Returns a new [EmployeeContactResponseDto] instance.
  EmployeeContactResponseDto({
    this.id,
    this.type,
    this.value,
    this.contactPersonName,
    this.relationship,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? id;

  final EmployeeContactResponseDtoTypeEnum? type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? value;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? contactPersonName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? relationship;

  /// The factory instance for creating [EmployeeContactResponseDto] from JSON.
  static const factory = EmployeeContactResponseDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is EmployeeContactResponseDto &&
    other.id == id &&
    other.type == type &&
    other.value == value &&
    other.contactPersonName == contactPersonName &&
    other.relationship == relationship;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (type == null ? 0 : type!.hashCode) +
    (value == null ? 0 : value!.hashCode) +
    (contactPersonName == null ? 0 : contactPersonName!.hashCode) +
    (relationship == null ? 0 : relationship!.hashCode);

  @override
  String toString() => 'EmployeeContactResponseDto[id=$id, type=$type, value=$value, contactPersonName=$contactPersonName, relationship=$relationship]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.value != null) {
      json[r'value'] = this.value;
    } else {
      json[r'value'] = null;
    }
    if (this.contactPersonName != null) {
      json[r'contactPersonName'] = this.contactPersonName;
    } else {
      json[r'contactPersonName'] = null;
    }
    if (this.relationship != null) {
      json[r'relationship'] = this.relationship;
    } else {
      json[r'relationship'] = null;
    }
    return json;
  }

  /// Returns a new [EmployeeContactResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static EmployeeContactResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "EmployeeContactResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "EmployeeContactResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return EmployeeContactResponseDto(
        id: json[r'id'] is int ? json[r'id'] as int : null,
        type: EmployeeContactResponseDtoTypeEnum.fromJson(json[r'type']),
        value: json[r'value'] is String ? json[r'value'] as String : null,
        contactPersonName: json[r'contactPersonName'] is String ? json[r'contactPersonName'] as String : null,
        relationship: json[r'relationship'] is String ? json[r'relationship'] as String : null,
      );
    }
    return null;
  }

  static List<EmployeeContactResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeContactResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeContactResponseDto.fromJson(row);
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
        final value = EmployeeContactResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of EmployeeContactResponseDto-objects as value to a dart map
  static Map<String, List<EmployeeContactResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<EmployeeContactResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = EmployeeContactResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [EmployeeContactResponseDto] instances from JSON data.
class EmployeeContactResponseDtoFactory extends JsonSchemaFactory<EmployeeContactResponseDto> {
  const EmployeeContactResponseDtoFactory();

  @override
  EmployeeContactResponseDto fromJson(dynamic json) => EmployeeContactResponseDto.fromJson(json)!;
}


class EmployeeContactResponseDtoTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const EmployeeContactResponseDtoTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const WORK_PHONE = EmployeeContactResponseDtoTypeEnum._(r'WORK_PHONE');
  static const PERSONAL_PHONE = EmployeeContactResponseDtoTypeEnum._(r'PERSONAL_PHONE');
  static const WORK_EMAIL = EmployeeContactResponseDtoTypeEnum._(r'WORK_EMAIL');
  static const PERSONAL_EMAIL = EmployeeContactResponseDtoTypeEnum._(r'PERSONAL_EMAIL');
  static const EMERGENCY_CONTACT = EmployeeContactResponseDtoTypeEnum._(r'EMERGENCY_CONTACT');

  /// List of all possible values in this [enum][EmployeeContactResponseDtoTypeEnum].
  static const values = <EmployeeContactResponseDtoTypeEnum>[
    WORK_PHONE,
    PERSONAL_PHONE,
    WORK_EMAIL,
    PERSONAL_EMAIL,
    EMERGENCY_CONTACT,
  ];

  static EmployeeContactResponseDtoTypeEnum? fromJson(dynamic value) => EmployeeContactResponseDtoTypeEnumTypeTransformer().decode(value);

  static List<EmployeeContactResponseDtoTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeContactResponseDtoTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeContactResponseDtoTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [EmployeeContactResponseDtoTypeEnum] to String,
/// and [decode] dynamic data back to [EmployeeContactResponseDtoTypeEnum].
class EmployeeContactResponseDtoTypeEnumTypeTransformer {
  factory EmployeeContactResponseDtoTypeEnumTypeTransformer() => _instance ??= const EmployeeContactResponseDtoTypeEnumTypeTransformer._();

  const EmployeeContactResponseDtoTypeEnumTypeTransformer._();

  String encode(EmployeeContactResponseDtoTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a EmployeeContactResponseDtoTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  EmployeeContactResponseDtoTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'WORK_PHONE': return EmployeeContactResponseDtoTypeEnum.WORK_PHONE;
        case r'PERSONAL_PHONE': return EmployeeContactResponseDtoTypeEnum.PERSONAL_PHONE;
        case r'WORK_EMAIL': return EmployeeContactResponseDtoTypeEnum.WORK_EMAIL;
        case r'PERSONAL_EMAIL': return EmployeeContactResponseDtoTypeEnum.PERSONAL_EMAIL;
        case r'EMERGENCY_CONTACT': return EmployeeContactResponseDtoTypeEnum.EMERGENCY_CONTACT;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [EmployeeContactResponseDtoTypeEnumTypeTransformer] instance.
  static EmployeeContactResponseDtoTypeEnumTypeTransformer? _instance;
}


