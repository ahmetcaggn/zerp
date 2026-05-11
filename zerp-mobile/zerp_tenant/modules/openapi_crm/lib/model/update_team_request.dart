//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class UpdateTeamRequest extends Schema {
  /// Returns a new [UpdateTeamRequest] instance.
  UpdateTeamRequest({
    this.name,
    this.description,
    this.type,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? name;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? description;

  final UpdateTeamRequestTypeEnum? type;

  /// The factory instance for creating [UpdateTeamRequest] from JSON.
  static const factory = UpdateTeamRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is UpdateTeamRequest &&
    other.name == name &&
    other.description == description &&
    other.type == type;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (type == null ? 0 : type!.hashCode);

  @override
  String toString() => 'UpdateTeamRequest[name=$name, description=$description, type=$type]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    return json;
  }

  /// Returns a new [UpdateTeamRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UpdateTeamRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "UpdateTeamRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "UpdateTeamRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UpdateTeamRequest(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        type: UpdateTeamRequestTypeEnum.fromJson(json[r'type']),
      );
    }
    return null;
  }

  static List<UpdateTeamRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UpdateTeamRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateTeamRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UpdateTeamRequest> mapFromJson(dynamic json) {
    final map = <String, UpdateTeamRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UpdateTeamRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UpdateTeamRequest-objects as value to a dart map
  static Map<String, List<UpdateTeamRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<UpdateTeamRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UpdateTeamRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [UpdateTeamRequest] instances from JSON data.
class UpdateTeamRequestFactory extends JsonSchemaFactory<UpdateTeamRequest> {
  const UpdateTeamRequestFactory();

  @override
  UpdateTeamRequest fromJson(dynamic json) => UpdateTeamRequest.fromJson(json)!;
}


class UpdateTeamRequestTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const UpdateTeamRequestTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const SERVICE_LEVEL = UpdateTeamRequestTypeEnum._(r'SERVICE_LEVEL');
  static const QUESTION = UpdateTeamRequestTypeEnum._(r'QUESTION');

  /// List of all possible values in this [enum][UpdateTeamRequestTypeEnum].
  static const values = <UpdateTeamRequestTypeEnum>[
    SERVICE_LEVEL,
    QUESTION,
  ];

  static UpdateTeamRequestTypeEnum? fromJson(dynamic value) => UpdateTeamRequestTypeEnumTypeTransformer().decode(value);

  static List<UpdateTeamRequestTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UpdateTeamRequestTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateTeamRequestTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [UpdateTeamRequestTypeEnum] to String,
/// and [decode] dynamic data back to [UpdateTeamRequestTypeEnum].
class UpdateTeamRequestTypeEnumTypeTransformer {
  factory UpdateTeamRequestTypeEnumTypeTransformer() => _instance ??= const UpdateTeamRequestTypeEnumTypeTransformer._();

  const UpdateTeamRequestTypeEnumTypeTransformer._();

  String encode(UpdateTeamRequestTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a UpdateTeamRequestTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  UpdateTeamRequestTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'SERVICE_LEVEL': return UpdateTeamRequestTypeEnum.SERVICE_LEVEL;
        case r'QUESTION': return UpdateTeamRequestTypeEnum.QUESTION;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [UpdateTeamRequestTypeEnumTypeTransformer] instance.
  static UpdateTeamRequestTypeEnumTypeTransformer? _instance;
}


