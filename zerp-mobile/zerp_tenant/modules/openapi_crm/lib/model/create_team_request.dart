//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class CreateTeamRequest extends Schema {
  /// Returns a new [CreateTeamRequest] instance.
  CreateTeamRequest({
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

  final CreateTeamRequestTypeEnum? type;

  /// The factory instance for creating [CreateTeamRequest] from JSON.
  static const factory = CreateTeamRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is CreateTeamRequest &&
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
  String toString() => 'CreateTeamRequest[name=$name, description=$description, type=$type]';

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

  /// Returns a new [CreateTeamRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CreateTeamRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CreateTeamRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CreateTeamRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CreateTeamRequest(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        type: CreateTeamRequestTypeEnum.fromJson(json[r'type']),
      );
    }
    return null;
  }

  static List<CreateTeamRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateTeamRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateTeamRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreateTeamRequest> mapFromJson(dynamic json) {
    final map = <String, CreateTeamRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreateTeamRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CreateTeamRequest-objects as value to a dart map
  static Map<String, List<CreateTeamRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CreateTeamRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CreateTeamRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [CreateTeamRequest] instances from JSON data.
class CreateTeamRequestFactory extends JsonSchemaFactory<CreateTeamRequest> {
  const CreateTeamRequestFactory();

  @override
  CreateTeamRequest fromJson(dynamic json) => CreateTeamRequest.fromJson(json)!;
}


class CreateTeamRequestTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const CreateTeamRequestTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const SERVICE_LEVEL = CreateTeamRequestTypeEnum._(r'SERVICE_LEVEL');
  static const QUESTION = CreateTeamRequestTypeEnum._(r'QUESTION');

  /// List of all possible values in this [enum][CreateTeamRequestTypeEnum].
  static const values = <CreateTeamRequestTypeEnum>[
    SERVICE_LEVEL,
    QUESTION,
  ];

  static CreateTeamRequestTypeEnum? fromJson(dynamic value) => CreateTeamRequestTypeEnumTypeTransformer().decode(value);

  static List<CreateTeamRequestTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateTeamRequestTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateTeamRequestTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [CreateTeamRequestTypeEnum] to String,
/// and [decode] dynamic data back to [CreateTeamRequestTypeEnum].
class CreateTeamRequestTypeEnumTypeTransformer {
  factory CreateTeamRequestTypeEnumTypeTransformer() => _instance ??= const CreateTeamRequestTypeEnumTypeTransformer._();

  const CreateTeamRequestTypeEnumTypeTransformer._();

  String encode(CreateTeamRequestTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a CreateTeamRequestTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  CreateTeamRequestTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'SERVICE_LEVEL': return CreateTeamRequestTypeEnum.SERVICE_LEVEL;
        case r'QUESTION': return CreateTeamRequestTypeEnum.QUESTION;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [CreateTeamRequestTypeEnumTypeTransformer] instance.
  static CreateTeamRequestTypeEnumTypeTransformer? _instance;
}


