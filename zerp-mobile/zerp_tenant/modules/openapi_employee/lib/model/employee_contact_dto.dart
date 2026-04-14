//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class EmployeeContactDto extends Schema {
  /// Returns a new [EmployeeContactDto] instance.
  EmployeeContactDto({
    this.id,
    required this.type,
    required this.value,
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

  final EmployeeContactDtoTypeEnum type;

  final String value;

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

  /// The factory instance for creating [EmployeeContactDto] from JSON.
  static const factory = EmployeeContactDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is EmployeeContactDto &&
    other.id == id &&
    other.type == type &&
    other.value == value &&
    other.contactPersonName == contactPersonName &&
    other.relationship == relationship;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (type.hashCode) +
    (value.hashCode) +
    (contactPersonName == null ? 0 : contactPersonName!.hashCode) +
    (relationship == null ? 0 : relationship!.hashCode);

  @override
  String toString() => 'EmployeeContactDto[id=$id, type=$type, value=$value, contactPersonName=$contactPersonName, relationship=$relationship]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
      json[r'type'] = this.type;
      json[r'value'] = this.value;
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

  /// Returns a new [EmployeeContactDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static EmployeeContactDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "EmployeeContactDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "EmployeeContactDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return EmployeeContactDto(
        id: json[r'id'] is int ? json[r'id'] as int : null,
        type: EmployeeContactDtoTypeEnum.fromJson(json[r'type'])!,
        value: json[r'value'] as String,
        contactPersonName: json[r'contactPersonName'] is String ? json[r'contactPersonName'] as String : null,
        relationship: json[r'relationship'] is String ? json[r'relationship'] as String : null,
      );
    }
    return null;
  }

  static List<EmployeeContactDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeContactDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeContactDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmployeeContactDto> mapFromJson(dynamic json) {
    final map = <String, EmployeeContactDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmployeeContactDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of EmployeeContactDto-objects as value to a dart map
  static Map<String, List<EmployeeContactDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<EmployeeContactDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = EmployeeContactDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'type',
    'value',
  };
}

/// Factory for creating [EmployeeContactDto] instances from JSON data.
class EmployeeContactDtoFactory extends JsonSchemaFactory<EmployeeContactDto> {
  const EmployeeContactDtoFactory();

  @override
  EmployeeContactDto fromJson(dynamic json) => EmployeeContactDto.fromJson(json)!;
}


class EmployeeContactDtoTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const EmployeeContactDtoTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const WORK_PHONE = EmployeeContactDtoTypeEnum._(r'WORK_PHONE');
  static const PERSONAL_PHONE = EmployeeContactDtoTypeEnum._(r'PERSONAL_PHONE');
  static const WORK_EMAIL = EmployeeContactDtoTypeEnum._(r'WORK_EMAIL');
  static const PERSONAL_EMAIL = EmployeeContactDtoTypeEnum._(r'PERSONAL_EMAIL');
  static const EMERGENCY_CONTACT = EmployeeContactDtoTypeEnum._(r'EMERGENCY_CONTACT');

  /// List of all possible values in this [enum][EmployeeContactDtoTypeEnum].
  static const values = <EmployeeContactDtoTypeEnum>[
    WORK_PHONE,
    PERSONAL_PHONE,
    WORK_EMAIL,
    PERSONAL_EMAIL,
    EMERGENCY_CONTACT,
  ];

  static EmployeeContactDtoTypeEnum? fromJson(dynamic value) => EmployeeContactDtoTypeEnumTypeTransformer().decode(value);

  static List<EmployeeContactDtoTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmployeeContactDtoTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmployeeContactDtoTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [EmployeeContactDtoTypeEnum] to String,
/// and [decode] dynamic data back to [EmployeeContactDtoTypeEnum].
class EmployeeContactDtoTypeEnumTypeTransformer {
  factory EmployeeContactDtoTypeEnumTypeTransformer() => _instance ??= const EmployeeContactDtoTypeEnumTypeTransformer._();

  const EmployeeContactDtoTypeEnumTypeTransformer._();

  String encode(EmployeeContactDtoTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a EmployeeContactDtoTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  EmployeeContactDtoTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'WORK_PHONE': return EmployeeContactDtoTypeEnum.WORK_PHONE;
        case r'PERSONAL_PHONE': return EmployeeContactDtoTypeEnum.PERSONAL_PHONE;
        case r'WORK_EMAIL': return EmployeeContactDtoTypeEnum.WORK_EMAIL;
        case r'PERSONAL_EMAIL': return EmployeeContactDtoTypeEnum.PERSONAL_EMAIL;
        case r'EMERGENCY_CONTACT': return EmployeeContactDtoTypeEnum.EMERGENCY_CONTACT;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [EmployeeContactDtoTypeEnumTypeTransformer] instance.
  static EmployeeContactDtoTypeEnumTypeTransformer? _instance;
}


