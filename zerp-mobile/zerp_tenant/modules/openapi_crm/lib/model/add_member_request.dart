//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class AddMemberRequest extends Schema {
  /// Returns a new [AddMemberRequest] instance.
  AddMemberRequest({
    this.userId,
    this.role,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? userId;

  final AddMemberRequestRoleEnum? role;

  /// The factory instance for creating [AddMemberRequest] from JSON.
  static const factory = AddMemberRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is AddMemberRequest &&
    other.userId == userId &&
    other.role == role;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (userId == null ? 0 : userId!.hashCode) +
    (role == null ? 0 : role!.hashCode);

  @override
  String toString() => 'AddMemberRequest[userId=$userId, role=$role]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.userId != null) {
      json[r'userId'] = this.userId;
    } else {
      json[r'userId'] = null;
    }
    if (this.role != null) {
      json[r'role'] = this.role;
    } else {
      json[r'role'] = null;
    }
    return json;
  }

  /// Returns a new [AddMemberRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AddMemberRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "AddMemberRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "AddMemberRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AddMemberRequest(
        userId: json[r'userId'] is String ? json[r'userId'] as String : null,
        role: AddMemberRequestRoleEnum.fromJson(json[r'role']),
      );
    }
    return null;
  }

  static List<AddMemberRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AddMemberRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AddMemberRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AddMemberRequest> mapFromJson(dynamic json) {
    final map = <String, AddMemberRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AddMemberRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AddMemberRequest-objects as value to a dart map
  static Map<String, List<AddMemberRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<AddMemberRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AddMemberRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [AddMemberRequest] instances from JSON data.
class AddMemberRequestFactory extends JsonSchemaFactory<AddMemberRequest> {
  const AddMemberRequestFactory();

  @override
  AddMemberRequest fromJson(dynamic json) => AddMemberRequest.fromJson(json)!;
}


class AddMemberRequestRoleEnum {
  /// Instantiate a new enum with the provided [value].
  const AddMemberRequestRoleEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const LEADER = AddMemberRequestRoleEnum._(r'LEADER');
  static const MEMBER = AddMemberRequestRoleEnum._(r'MEMBER');

  /// List of all possible values in this [enum][AddMemberRequestRoleEnum].
  static const values = <AddMemberRequestRoleEnum>[
    LEADER,
    MEMBER,
  ];

  static AddMemberRequestRoleEnum? fromJson(dynamic value) => AddMemberRequestRoleEnumTypeTransformer().decode(value);

  static List<AddMemberRequestRoleEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AddMemberRequestRoleEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AddMemberRequestRoleEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [AddMemberRequestRoleEnum] to String,
/// and [decode] dynamic data back to [AddMemberRequestRoleEnum].
class AddMemberRequestRoleEnumTypeTransformer {
  factory AddMemberRequestRoleEnumTypeTransformer() => _instance ??= const AddMemberRequestRoleEnumTypeTransformer._();

  const AddMemberRequestRoleEnumTypeTransformer._();

  String encode(AddMemberRequestRoleEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a AddMemberRequestRoleEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  AddMemberRequestRoleEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'LEADER': return AddMemberRequestRoleEnum.LEADER;
        case r'MEMBER': return AddMemberRequestRoleEnum.MEMBER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [AddMemberRequestRoleEnumTypeTransformer] instance.
  static AddMemberRequestRoleEnumTypeTransformer? _instance;
}


