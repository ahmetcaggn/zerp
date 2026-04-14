//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class ChangeMemberRoleRequest extends Schema {
  /// Returns a new [ChangeMemberRoleRequest] instance.
  ChangeMemberRoleRequest({
    this.role,
  });

  final ChangeMemberRoleRequestRoleEnum? role;

  /// The factory instance for creating [ChangeMemberRoleRequest] from JSON.
  static const factory = ChangeMemberRoleRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ChangeMemberRoleRequest &&
    other.role == role;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (role == null ? 0 : role!.hashCode);

  @override
  String toString() => 'ChangeMemberRoleRequest[role=$role]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.role != null) {
      json[r'role'] = this.role;
    } else {
      json[r'role'] = null;
    }
    return json;
  }

  /// Returns a new [ChangeMemberRoleRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ChangeMemberRoleRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ChangeMemberRoleRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ChangeMemberRoleRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ChangeMemberRoleRequest(
        role: ChangeMemberRoleRequestRoleEnum.fromJson(json[r'role']),
      );
    }
    return null;
  }

  static List<ChangeMemberRoleRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChangeMemberRoleRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeMemberRoleRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChangeMemberRoleRequest> mapFromJson(dynamic json) {
    final map = <String, ChangeMemberRoleRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChangeMemberRoleRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ChangeMemberRoleRequest-objects as value to a dart map
  static Map<String, List<ChangeMemberRoleRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ChangeMemberRoleRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ChangeMemberRoleRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ChangeMemberRoleRequest] instances from JSON data.
class ChangeMemberRoleRequestFactory extends JsonSchemaFactory<ChangeMemberRoleRequest> {
  const ChangeMemberRoleRequestFactory();

  @override
  ChangeMemberRoleRequest fromJson(dynamic json) => ChangeMemberRoleRequest.fromJson(json)!;
}


class ChangeMemberRoleRequestRoleEnum {
  /// Instantiate a new enum with the provided [value].
  const ChangeMemberRoleRequestRoleEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const LEADER = ChangeMemberRoleRequestRoleEnum._(r'LEADER');
  static const MEMBER = ChangeMemberRoleRequestRoleEnum._(r'MEMBER');

  /// List of all possible values in this [enum][ChangeMemberRoleRequestRoleEnum].
  static const values = <ChangeMemberRoleRequestRoleEnum>[
    LEADER,
    MEMBER,
  ];

  static ChangeMemberRoleRequestRoleEnum? fromJson(dynamic value) => ChangeMemberRoleRequestRoleEnumTypeTransformer().decode(value);

  static List<ChangeMemberRoleRequestRoleEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChangeMemberRoleRequestRoleEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeMemberRoleRequestRoleEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ChangeMemberRoleRequestRoleEnum] to String,
/// and [decode] dynamic data back to [ChangeMemberRoleRequestRoleEnum].
class ChangeMemberRoleRequestRoleEnumTypeTransformer {
  factory ChangeMemberRoleRequestRoleEnumTypeTransformer() => _instance ??= const ChangeMemberRoleRequestRoleEnumTypeTransformer._();

  const ChangeMemberRoleRequestRoleEnumTypeTransformer._();

  String encode(ChangeMemberRoleRequestRoleEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ChangeMemberRoleRequestRoleEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ChangeMemberRoleRequestRoleEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'LEADER': return ChangeMemberRoleRequestRoleEnum.LEADER;
        case r'MEMBER': return ChangeMemberRoleRequestRoleEnum.MEMBER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ChangeMemberRoleRequestRoleEnumTypeTransformer] instance.
  static ChangeMemberRoleRequestRoleEnumTypeTransformer? _instance;
}


