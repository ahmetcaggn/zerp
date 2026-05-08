//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class CreateTicketRequest extends Schema {
  /// Returns a new [CreateTicketRequest] instance.
  CreateTicketRequest({
    this.title,
    this.description,
    this.priority,
    this.type,
    this.tenantId,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? title;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? description;

  final CreateTicketRequestPriorityEnum? priority;

  final CreateTicketRequestTypeEnum? type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? tenantId;

  /// The factory instance for creating [CreateTicketRequest] from JSON.
  static const factory = CreateTicketRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is CreateTicketRequest &&
    other.title == title &&
    other.description == description &&
    other.priority == priority &&
    other.type == type &&
    other.tenantId == tenantId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (title == null ? 0 : title!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (priority == null ? 0 : priority!.hashCode) +
    (type == null ? 0 : type!.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode);

  @override
  String toString() => 'CreateTicketRequest[title=$title, description=$description, priority=$priority, type=$type, tenantId=$tenantId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.title != null) {
      json[r'title'] = this.title;
    } else {
      json[r'title'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.priority != null) {
      json[r'priority'] = this.priority;
    } else {
      json[r'priority'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    return json;
  }

  /// Returns a new [CreateTicketRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CreateTicketRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CreateTicketRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CreateTicketRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CreateTicketRequest(
        title: json[r'title'] is String ? json[r'title'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        priority: CreateTicketRequestPriorityEnum.fromJson(json[r'priority']),
        type: CreateTicketRequestTypeEnum.fromJson(json[r'type']),
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
      );
    }
    return null;
  }

  static List<CreateTicketRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateTicketRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateTicketRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreateTicketRequest> mapFromJson(dynamic json) {
    final map = <String, CreateTicketRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreateTicketRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CreateTicketRequest-objects as value to a dart map
  static Map<String, List<CreateTicketRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CreateTicketRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CreateTicketRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [CreateTicketRequest] instances from JSON data.
class CreateTicketRequestFactory extends JsonSchemaFactory<CreateTicketRequest> {
  const CreateTicketRequestFactory();

  @override
  CreateTicketRequest fromJson(dynamic json) => CreateTicketRequest.fromJson(json)!;
}


class CreateTicketRequestPriorityEnum {
  /// Instantiate a new enum with the provided [value].
  const CreateTicketRequestPriorityEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const LOW = CreateTicketRequestPriorityEnum._(r'LOW');
  static const MEDIUM = CreateTicketRequestPriorityEnum._(r'MEDIUM');
  static const HIGH = CreateTicketRequestPriorityEnum._(r'HIGH');
  static const CRITICAL = CreateTicketRequestPriorityEnum._(r'CRITICAL');

  /// List of all possible values in this [enum][CreateTicketRequestPriorityEnum].
  static const values = <CreateTicketRequestPriorityEnum>[
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL,
  ];

  static CreateTicketRequestPriorityEnum? fromJson(dynamic value) => CreateTicketRequestPriorityEnumTypeTransformer().decode(value);

  static List<CreateTicketRequestPriorityEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateTicketRequestPriorityEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateTicketRequestPriorityEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [CreateTicketRequestPriorityEnum] to String,
/// and [decode] dynamic data back to [CreateTicketRequestPriorityEnum].
class CreateTicketRequestPriorityEnumTypeTransformer {
  factory CreateTicketRequestPriorityEnumTypeTransformer() => _instance ??= const CreateTicketRequestPriorityEnumTypeTransformer._();

  const CreateTicketRequestPriorityEnumTypeTransformer._();

  String encode(CreateTicketRequestPriorityEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a CreateTicketRequestPriorityEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  CreateTicketRequestPriorityEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'LOW': return CreateTicketRequestPriorityEnum.LOW;
        case r'MEDIUM': return CreateTicketRequestPriorityEnum.MEDIUM;
        case r'HIGH': return CreateTicketRequestPriorityEnum.HIGH;
        case r'CRITICAL': return CreateTicketRequestPriorityEnum.CRITICAL;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [CreateTicketRequestPriorityEnumTypeTransformer] instance.
  static CreateTicketRequestPriorityEnumTypeTransformer? _instance;
}



class CreateTicketRequestTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const CreateTicketRequestTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const BUG = CreateTicketRequestTypeEnum._(r'BUG');
  static const FEATURE_REQUEST = CreateTicketRequestTypeEnum._(r'FEATURE_REQUEST');
  static const QUESTION = CreateTicketRequestTypeEnum._(r'QUESTION');
  static const INCIDENT = CreateTicketRequestTypeEnum._(r'INCIDENT');

  /// List of all possible values in this [enum][CreateTicketRequestTypeEnum].
  static const values = <CreateTicketRequestTypeEnum>[
    BUG,
    FEATURE_REQUEST,
    QUESTION,
    INCIDENT,
  ];

  static CreateTicketRequestTypeEnum? fromJson(dynamic value) => CreateTicketRequestTypeEnumTypeTransformer().decode(value);

  static List<CreateTicketRequestTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateTicketRequestTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateTicketRequestTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [CreateTicketRequestTypeEnum] to String,
/// and [decode] dynamic data back to [CreateTicketRequestTypeEnum].
class CreateTicketRequestTypeEnumTypeTransformer {
  factory CreateTicketRequestTypeEnumTypeTransformer() => _instance ??= const CreateTicketRequestTypeEnumTypeTransformer._();

  const CreateTicketRequestTypeEnumTypeTransformer._();

  String encode(CreateTicketRequestTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a CreateTicketRequestTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  CreateTicketRequestTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'BUG': return CreateTicketRequestTypeEnum.BUG;
        case r'FEATURE_REQUEST': return CreateTicketRequestTypeEnum.FEATURE_REQUEST;
        case r'QUESTION': return CreateTicketRequestTypeEnum.QUESTION;
        case r'INCIDENT': return CreateTicketRequestTypeEnum.INCIDENT;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [CreateTicketRequestTypeEnumTypeTransformer] instance.
  static CreateTicketRequestTypeEnumTypeTransformer? _instance;
}


