//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class ChangePriorityRequest extends Schema {
  /// Returns a new [ChangePriorityRequest] instance.
  ChangePriorityRequest({
    this.priority,
  });

  final ChangePriorityRequestPriorityEnum? priority;

  /// The factory instance for creating [ChangePriorityRequest] from JSON.
  static const factory = ChangePriorityRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ChangePriorityRequest &&
    other.priority == priority;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (priority == null ? 0 : priority!.hashCode);

  @override
  String toString() => 'ChangePriorityRequest[priority=$priority]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.priority != null) {
      json[r'priority'] = this.priority;
    } else {
      json[r'priority'] = null;
    }
    return json;
  }

  /// Returns a new [ChangePriorityRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ChangePriorityRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ChangePriorityRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ChangePriorityRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ChangePriorityRequest(
        priority: ChangePriorityRequestPriorityEnum.fromJson(json[r'priority']),
      );
    }
    return null;
  }

  static List<ChangePriorityRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChangePriorityRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangePriorityRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChangePriorityRequest> mapFromJson(dynamic json) {
    final map = <String, ChangePriorityRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChangePriorityRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ChangePriorityRequest-objects as value to a dart map
  static Map<String, List<ChangePriorityRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ChangePriorityRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ChangePriorityRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ChangePriorityRequest] instances from JSON data.
class ChangePriorityRequestFactory extends JsonSchemaFactory<ChangePriorityRequest> {
  const ChangePriorityRequestFactory();

  @override
  ChangePriorityRequest fromJson(dynamic json) => ChangePriorityRequest.fromJson(json)!;
}


class ChangePriorityRequestPriorityEnum {
  /// Instantiate a new enum with the provided [value].
  const ChangePriorityRequestPriorityEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const LOW = ChangePriorityRequestPriorityEnum._(r'LOW');
  static const MEDIUM = ChangePriorityRequestPriorityEnum._(r'MEDIUM');
  static const HIGH = ChangePriorityRequestPriorityEnum._(r'HIGH');
  static const CRITICAL = ChangePriorityRequestPriorityEnum._(r'CRITICAL');

  /// List of all possible values in this [enum][ChangePriorityRequestPriorityEnum].
  static const values = <ChangePriorityRequestPriorityEnum>[
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL,
  ];

  static ChangePriorityRequestPriorityEnum? fromJson(dynamic value) => ChangePriorityRequestPriorityEnumTypeTransformer().decode(value);

  static List<ChangePriorityRequestPriorityEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChangePriorityRequestPriorityEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangePriorityRequestPriorityEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ChangePriorityRequestPriorityEnum] to String,
/// and [decode] dynamic data back to [ChangePriorityRequestPriorityEnum].
class ChangePriorityRequestPriorityEnumTypeTransformer {
  factory ChangePriorityRequestPriorityEnumTypeTransformer() => _instance ??= const ChangePriorityRequestPriorityEnumTypeTransformer._();

  const ChangePriorityRequestPriorityEnumTypeTransformer._();

  String encode(ChangePriorityRequestPriorityEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ChangePriorityRequestPriorityEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ChangePriorityRequestPriorityEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'LOW': return ChangePriorityRequestPriorityEnum.LOW;
        case r'MEDIUM': return ChangePriorityRequestPriorityEnum.MEDIUM;
        case r'HIGH': return ChangePriorityRequestPriorityEnum.HIGH;
        case r'CRITICAL': return ChangePriorityRequestPriorityEnum.CRITICAL;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ChangePriorityRequestPriorityEnumTypeTransformer] instance.
  static ChangePriorityRequestPriorityEnumTypeTransformer? _instance;
}


