//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class PermissionResponse extends Schema {
  /// Returns a new [PermissionResponse] instance.
  PermissionResponse({
    this.id,
    this.userId,
    this.targetType,
    this.targetId,
    this.action,
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
  final String? userId;

  final PermissionResponseTargetTypeEnum? targetType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? targetId;

  final PermissionResponseActionEnum? action;

  /// The factory instance for creating [PermissionResponse] from JSON.
  static const factory = PermissionResponseFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is PermissionResponse &&
    other.id == id &&
    other.userId == userId &&
    other.targetType == targetType &&
    other.targetId == targetId &&
    other.action == action;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (userId == null ? 0 : userId!.hashCode) +
    (targetType == null ? 0 : targetType!.hashCode) +
    (targetId == null ? 0 : targetId!.hashCode) +
    (action == null ? 0 : action!.hashCode);

  @override
  String toString() => 'PermissionResponse[id=$id, userId=$userId, targetType=$targetType, targetId=$targetId, action=$action]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.userId != null) {
      json[r'userId'] = this.userId;
    } else {
      json[r'userId'] = null;
    }
    if (this.targetType != null) {
      json[r'targetType'] = this.targetType;
    } else {
      json[r'targetType'] = null;
    }
    if (this.targetId != null) {
      json[r'targetId'] = this.targetId;
    } else {
      json[r'targetId'] = null;
    }
    if (this.action != null) {
      json[r'action'] = this.action;
    } else {
      json[r'action'] = null;
    }
    return json;
  }

  /// Returns a new [PermissionResponse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PermissionResponse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "PermissionResponse[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "PermissionResponse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PermissionResponse(
        id: json[r'id'] is int ? json[r'id'] as int : null,
        userId: json[r'userId'] is String ? json[r'userId'] as String : null,
        targetType: PermissionResponseTargetTypeEnum.fromJson(json[r'targetType']),
        targetId: json[r'targetId'] is String ? json[r'targetId'] as String : null,
        action: PermissionResponseActionEnum.fromJson(json[r'action']),
      );
    }
    return null;
  }

  static List<PermissionResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionResponse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PermissionResponse> mapFromJson(dynamic json) {
    final map = <String, PermissionResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PermissionResponse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PermissionResponse-objects as value to a dart map
  static Map<String, List<PermissionResponse>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PermissionResponse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PermissionResponse.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [PermissionResponse] instances from JSON data.
class PermissionResponseFactory extends JsonSchemaFactory<PermissionResponse> {
  const PermissionResponseFactory();

  @override
  PermissionResponse fromJson(dynamic json) => PermissionResponse.fromJson(json)!;
}


class PermissionResponseTargetTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const PermissionResponseTargetTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const TENANT_ROOT = PermissionResponseTargetTypeEnum._(r'TENANT_ROOT');
  static const TENANT = PermissionResponseTargetTypeEnum._(r'TENANT');
  static const USER = PermissionResponseTargetTypeEnum._(r'USER');
  static const STOCK_RESOURCE = PermissionResponseTargetTypeEnum._(r'STOCK_RESOURCE');
  static const EMPLOYEE = PermissionResponseTargetTypeEnum._(r'EMPLOYEE');
  static const TICKET = PermissionResponseTargetTypeEnum._(r'TICKET');
  static const TICKET_HISTORY = PermissionResponseTargetTypeEnum._(r'TICKET_HISTORY');
  static const TICKET_COMMENT = PermissionResponseTargetTypeEnum._(r'TICKET_COMMENT');
  static const TICKET_ASSIGNMENT = PermissionResponseTargetTypeEnum._(r'TICKET_ASSIGNMENT');
  static const TICKET_ATTACHMENT = PermissionResponseTargetTypeEnum._(r'TICKET_ATTACHMENT');
  static const TICKET_SLA_TRACKING = PermissionResponseTargetTypeEnum._(r'TICKET_SLA_TRACKING');
  static const TICKET_WATCHER = PermissionResponseTargetTypeEnum._(r'TICKET_WATCHER');
  static const TEAM = PermissionResponseTargetTypeEnum._(r'TEAM');
  static const TEAM_MEMBER = PermissionResponseTargetTypeEnum._(r'TEAM_MEMBER');
  static const SHOP = PermissionResponseTargetTypeEnum._(r'SHOP');

  /// List of all possible values in this [enum][PermissionResponseTargetTypeEnum].
  static const values = <PermissionResponseTargetTypeEnum>[
    TENANT_ROOT,
    TENANT,
    USER,
    STOCK_RESOURCE,
    EMPLOYEE,
    TICKET,
    TICKET_HISTORY,
    TICKET_COMMENT,
    TICKET_ASSIGNMENT,
    TICKET_ATTACHMENT,
    TICKET_SLA_TRACKING,
    TICKET_WATCHER,
    TEAM,
    TEAM_MEMBER,
    SHOP,
  ];

  static PermissionResponseTargetTypeEnum? fromJson(dynamic value) => PermissionResponseTargetTypeEnumTypeTransformer().decode(value);

  static List<PermissionResponseTargetTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionResponseTargetTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionResponseTargetTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PermissionResponseTargetTypeEnum] to String,
/// and [decode] dynamic data back to [PermissionResponseTargetTypeEnum].
class PermissionResponseTargetTypeEnumTypeTransformer {
  factory PermissionResponseTargetTypeEnumTypeTransformer() => _instance ??= const PermissionResponseTargetTypeEnumTypeTransformer._();

  const PermissionResponseTargetTypeEnumTypeTransformer._();

  String encode(PermissionResponseTargetTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a PermissionResponseTargetTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PermissionResponseTargetTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'TENANT_ROOT': return PermissionResponseTargetTypeEnum.TENANT_ROOT;
        case r'TENANT': return PermissionResponseTargetTypeEnum.TENANT;
        case r'USER': return PermissionResponseTargetTypeEnum.USER;
        case r'STOCK_RESOURCE': return PermissionResponseTargetTypeEnum.STOCK_RESOURCE;
        case r'EMPLOYEE': return PermissionResponseTargetTypeEnum.EMPLOYEE;
        case r'TICKET': return PermissionResponseTargetTypeEnum.TICKET;
        case r'TICKET_HISTORY': return PermissionResponseTargetTypeEnum.TICKET_HISTORY;
        case r'TICKET_COMMENT': return PermissionResponseTargetTypeEnum.TICKET_COMMENT;
        case r'TICKET_ASSIGNMENT': return PermissionResponseTargetTypeEnum.TICKET_ASSIGNMENT;
        case r'TICKET_ATTACHMENT': return PermissionResponseTargetTypeEnum.TICKET_ATTACHMENT;
        case r'TICKET_SLA_TRACKING': return PermissionResponseTargetTypeEnum.TICKET_SLA_TRACKING;
        case r'TICKET_WATCHER': return PermissionResponseTargetTypeEnum.TICKET_WATCHER;
        case r'TEAM': return PermissionResponseTargetTypeEnum.TEAM;
        case r'TEAM_MEMBER': return PermissionResponseTargetTypeEnum.TEAM_MEMBER;
        case r'SHOP': return PermissionResponseTargetTypeEnum.SHOP;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PermissionResponseTargetTypeEnumTypeTransformer] instance.
  static PermissionResponseTargetTypeEnumTypeTransformer? _instance;
}



class PermissionResponseActionEnum {
  /// Instantiate a new enum with the provided [value].
  const PermissionResponseActionEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const CREATE_TEAM = PermissionResponseActionEnum._(r'CREATE_TEAM');
  static const ADMIN_TENANT = PermissionResponseActionEnum._(r'ADMIN_TENANT');
  static const UPDATE_TENANT = PermissionResponseActionEnum._(r'UPDATE_TENANT');
  static const READ_TENANT = PermissionResponseActionEnum._(r'READ_TENANT');
  static const CREATE_STOCK_RESOURCE = PermissionResponseActionEnum._(r'CREATE_STOCK_RESOURCE');
  static const CREATE_EMPLOYEE = PermissionResponseActionEnum._(r'CREATE_EMPLOYEE');
  static const CREATE_TICKET = PermissionResponseActionEnum._(r'CREATE_TICKET');
  static const READ_USER = PermissionResponseActionEnum._(r'READ_USER');
  static const READ_PERMISSION = PermissionResponseActionEnum._(r'READ_PERMISSION');
  static const ADMIN_STOCK_RESOURCE = PermissionResponseActionEnum._(r'ADMIN_STOCK_RESOURCE');
  static const UPDATE_STOCK_RESOURCE = PermissionResponseActionEnum._(r'UPDATE_STOCK_RESOURCE');
  static const DELETE_STOCK_RESOURCE = PermissionResponseActionEnum._(r'DELETE_STOCK_RESOURCE');
  static const READ_STOCK_RESOURCE = PermissionResponseActionEnum._(r'READ_STOCK_RESOURCE');
  static const READ_EMPLOYEE = PermissionResponseActionEnum._(r'READ_EMPLOYEE');
  static const UPDATE_EMPLOYEE = PermissionResponseActionEnum._(r'UPDATE_EMPLOYEE');
  static const DELETE_EMPLOYEE = PermissionResponseActionEnum._(r'DELETE_EMPLOYEE');
  static const READ_TEAM = PermissionResponseActionEnum._(r'READ_TEAM');
  static const UPDATE_TEAM = PermissionResponseActionEnum._(r'UPDATE_TEAM');
  static const DELETE_TEAM = PermissionResponseActionEnum._(r'DELETE_TEAM');
  static const CREATE_TEAM_MEMBER = PermissionResponseActionEnum._(r'CREATE_TEAM_MEMBER');
  static const READ_TEAM_MEMBER = PermissionResponseActionEnum._(r'READ_TEAM_MEMBER');
  static const UPDATE_TEAM_MEMBER = PermissionResponseActionEnum._(r'UPDATE_TEAM_MEMBER');
  static const DELETE_TEAM_MEMBER = PermissionResponseActionEnum._(r'DELETE_TEAM_MEMBER');
  static const READ_TICKET = PermissionResponseActionEnum._(r'READ_TICKET');
  static const UPDATE_TICKET = PermissionResponseActionEnum._(r'UPDATE_TICKET');
  static const DELETE_TICKET = PermissionResponseActionEnum._(r'DELETE_TICKET');
  static const CREATE_TICKET_HISTORY = PermissionResponseActionEnum._(r'CREATE_TICKET_HISTORY');
  static const CREATE_TICKET_COMMENT = PermissionResponseActionEnum._(r'CREATE_TICKET_COMMENT');
  static const CREATE_TICKET_ASSIGNMENT = PermissionResponseActionEnum._(r'CREATE_TICKET_ASSIGNMENT');
  static const CREATE_TICKET_ATTACHMENT = PermissionResponseActionEnum._(r'CREATE_TICKET_ATTACHMENT');
  static const CREATE_TICKET_SLA_TRACKING = PermissionResponseActionEnum._(r'CREATE_TICKET_SLA_TRACKING');
  static const CREATE_TICKET_WATCHER = PermissionResponseActionEnum._(r'CREATE_TICKET_WATCHER');
  static const READ_TICKET_HISTORY = PermissionResponseActionEnum._(r'READ_TICKET_HISTORY');
  static const UPDATE_TICKET_HISTORY = PermissionResponseActionEnum._(r'UPDATE_TICKET_HISTORY');
  static const DELETE_TICKET_HISTORY = PermissionResponseActionEnum._(r'DELETE_TICKET_HISTORY');
  static const READ_TICKET_COMMENT = PermissionResponseActionEnum._(r'READ_TICKET_COMMENT');
  static const UPDATE_TICKET_COMMENT = PermissionResponseActionEnum._(r'UPDATE_TICKET_COMMENT');
  static const DELETE_TICKET_COMMENT = PermissionResponseActionEnum._(r'DELETE_TICKET_COMMENT');
  static const READ_TICKET_ASSIGNMENT = PermissionResponseActionEnum._(r'READ_TICKET_ASSIGNMENT');
  static const UPDATE_TICKET_ASSIGNMENT = PermissionResponseActionEnum._(r'UPDATE_TICKET_ASSIGNMENT');
  static const DELETE_TICKET_ASSIGNMENT = PermissionResponseActionEnum._(r'DELETE_TICKET_ASSIGNMENT');
  static const READ_TICKET_ATTACHMENT = PermissionResponseActionEnum._(r'READ_TICKET_ATTACHMENT');
  static const UPDATE_TICKET_ATTACHMENT = PermissionResponseActionEnum._(r'UPDATE_TICKET_ATTACHMENT');
  static const DELETE_TICKET_ATTACHMENT = PermissionResponseActionEnum._(r'DELETE_TICKET_ATTACHMENT');
  static const READ_TICKET_SLA_TRACKING = PermissionResponseActionEnum._(r'READ_TICKET_SLA_TRACKING');
  static const UPDATE_TICKET_SLA_TRACKING = PermissionResponseActionEnum._(r'UPDATE_TICKET_SLA_TRACKING');
  static const DELETE_TICKET_SLA_TRACKING = PermissionResponseActionEnum._(r'DELETE_TICKET_SLA_TRACKING');
  static const READ_TICKET_WATCHER = PermissionResponseActionEnum._(r'READ_TICKET_WATCHER');
  static const UPDATE_TICKET_WATCHER = PermissionResponseActionEnum._(r'UPDATE_TICKET_WATCHER');
  static const DELETE_TICKET_WATCHER = PermissionResponseActionEnum._(r'DELETE_TICKET_WATCHER');

  /// List of all possible values in this [enum][PermissionResponseActionEnum].
  static const values = <PermissionResponseActionEnum>[
    CREATE_TEAM,
    ADMIN_TENANT,
    UPDATE_TENANT,
    READ_TENANT,
    CREATE_STOCK_RESOURCE,
    CREATE_EMPLOYEE,
    CREATE_TICKET,
    READ_USER,
    READ_PERMISSION,
    ADMIN_STOCK_RESOURCE,
    UPDATE_STOCK_RESOURCE,
    DELETE_STOCK_RESOURCE,
    READ_STOCK_RESOURCE,
    READ_EMPLOYEE,
    UPDATE_EMPLOYEE,
    DELETE_EMPLOYEE,
    READ_TEAM,
    UPDATE_TEAM,
    DELETE_TEAM,
    CREATE_TEAM_MEMBER,
    READ_TEAM_MEMBER,
    UPDATE_TEAM_MEMBER,
    DELETE_TEAM_MEMBER,
    READ_TICKET,
    UPDATE_TICKET,
    DELETE_TICKET,
    CREATE_TICKET_HISTORY,
    CREATE_TICKET_COMMENT,
    CREATE_TICKET_ASSIGNMENT,
    CREATE_TICKET_ATTACHMENT,
    CREATE_TICKET_SLA_TRACKING,
    CREATE_TICKET_WATCHER,
    READ_TICKET_HISTORY,
    UPDATE_TICKET_HISTORY,
    DELETE_TICKET_HISTORY,
    READ_TICKET_COMMENT,
    UPDATE_TICKET_COMMENT,
    DELETE_TICKET_COMMENT,
    READ_TICKET_ASSIGNMENT,
    UPDATE_TICKET_ASSIGNMENT,
    DELETE_TICKET_ASSIGNMENT,
    READ_TICKET_ATTACHMENT,
    UPDATE_TICKET_ATTACHMENT,
    DELETE_TICKET_ATTACHMENT,
    READ_TICKET_SLA_TRACKING,
    UPDATE_TICKET_SLA_TRACKING,
    DELETE_TICKET_SLA_TRACKING,
    READ_TICKET_WATCHER,
    UPDATE_TICKET_WATCHER,
    DELETE_TICKET_WATCHER,
  ];

  static PermissionResponseActionEnum? fromJson(dynamic value) => PermissionResponseActionEnumTypeTransformer().decode(value);

  static List<PermissionResponseActionEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionResponseActionEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionResponseActionEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PermissionResponseActionEnum] to String,
/// and [decode] dynamic data back to [PermissionResponseActionEnum].
class PermissionResponseActionEnumTypeTransformer {
  factory PermissionResponseActionEnumTypeTransformer() => _instance ??= const PermissionResponseActionEnumTypeTransformer._();

  const PermissionResponseActionEnumTypeTransformer._();

  String encode(PermissionResponseActionEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a PermissionResponseActionEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PermissionResponseActionEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'CREATE_TEAM': return PermissionResponseActionEnum.CREATE_TEAM;
        case r'ADMIN_TENANT': return PermissionResponseActionEnum.ADMIN_TENANT;
        case r'UPDATE_TENANT': return PermissionResponseActionEnum.UPDATE_TENANT;
        case r'READ_TENANT': return PermissionResponseActionEnum.READ_TENANT;
        case r'CREATE_STOCK_RESOURCE': return PermissionResponseActionEnum.CREATE_STOCK_RESOURCE;
        case r'CREATE_EMPLOYEE': return PermissionResponseActionEnum.CREATE_EMPLOYEE;
        case r'CREATE_TICKET': return PermissionResponseActionEnum.CREATE_TICKET;
        case r'READ_USER': return PermissionResponseActionEnum.READ_USER;
        case r'READ_PERMISSION': return PermissionResponseActionEnum.READ_PERMISSION;
        case r'ADMIN_STOCK_RESOURCE': return PermissionResponseActionEnum.ADMIN_STOCK_RESOURCE;
        case r'UPDATE_STOCK_RESOURCE': return PermissionResponseActionEnum.UPDATE_STOCK_RESOURCE;
        case r'DELETE_STOCK_RESOURCE': return PermissionResponseActionEnum.DELETE_STOCK_RESOURCE;
        case r'READ_STOCK_RESOURCE': return PermissionResponseActionEnum.READ_STOCK_RESOURCE;
        case r'READ_EMPLOYEE': return PermissionResponseActionEnum.READ_EMPLOYEE;
        case r'UPDATE_EMPLOYEE': return PermissionResponseActionEnum.UPDATE_EMPLOYEE;
        case r'DELETE_EMPLOYEE': return PermissionResponseActionEnum.DELETE_EMPLOYEE;
        case r'READ_TEAM': return PermissionResponseActionEnum.READ_TEAM;
        case r'UPDATE_TEAM': return PermissionResponseActionEnum.UPDATE_TEAM;
        case r'DELETE_TEAM': return PermissionResponseActionEnum.DELETE_TEAM;
        case r'CREATE_TEAM_MEMBER': return PermissionResponseActionEnum.CREATE_TEAM_MEMBER;
        case r'READ_TEAM_MEMBER': return PermissionResponseActionEnum.READ_TEAM_MEMBER;
        case r'UPDATE_TEAM_MEMBER': return PermissionResponseActionEnum.UPDATE_TEAM_MEMBER;
        case r'DELETE_TEAM_MEMBER': return PermissionResponseActionEnum.DELETE_TEAM_MEMBER;
        case r'READ_TICKET': return PermissionResponseActionEnum.READ_TICKET;
        case r'UPDATE_TICKET': return PermissionResponseActionEnum.UPDATE_TICKET;
        case r'DELETE_TICKET': return PermissionResponseActionEnum.DELETE_TICKET;
        case r'CREATE_TICKET_HISTORY': return PermissionResponseActionEnum.CREATE_TICKET_HISTORY;
        case r'CREATE_TICKET_COMMENT': return PermissionResponseActionEnum.CREATE_TICKET_COMMENT;
        case r'CREATE_TICKET_ASSIGNMENT': return PermissionResponseActionEnum.CREATE_TICKET_ASSIGNMENT;
        case r'CREATE_TICKET_ATTACHMENT': return PermissionResponseActionEnum.CREATE_TICKET_ATTACHMENT;
        case r'CREATE_TICKET_SLA_TRACKING': return PermissionResponseActionEnum.CREATE_TICKET_SLA_TRACKING;
        case r'CREATE_TICKET_WATCHER': return PermissionResponseActionEnum.CREATE_TICKET_WATCHER;
        case r'READ_TICKET_HISTORY': return PermissionResponseActionEnum.READ_TICKET_HISTORY;
        case r'UPDATE_TICKET_HISTORY': return PermissionResponseActionEnum.UPDATE_TICKET_HISTORY;
        case r'DELETE_TICKET_HISTORY': return PermissionResponseActionEnum.DELETE_TICKET_HISTORY;
        case r'READ_TICKET_COMMENT': return PermissionResponseActionEnum.READ_TICKET_COMMENT;
        case r'UPDATE_TICKET_COMMENT': return PermissionResponseActionEnum.UPDATE_TICKET_COMMENT;
        case r'DELETE_TICKET_COMMENT': return PermissionResponseActionEnum.DELETE_TICKET_COMMENT;
        case r'READ_TICKET_ASSIGNMENT': return PermissionResponseActionEnum.READ_TICKET_ASSIGNMENT;
        case r'UPDATE_TICKET_ASSIGNMENT': return PermissionResponseActionEnum.UPDATE_TICKET_ASSIGNMENT;
        case r'DELETE_TICKET_ASSIGNMENT': return PermissionResponseActionEnum.DELETE_TICKET_ASSIGNMENT;
        case r'READ_TICKET_ATTACHMENT': return PermissionResponseActionEnum.READ_TICKET_ATTACHMENT;
        case r'UPDATE_TICKET_ATTACHMENT': return PermissionResponseActionEnum.UPDATE_TICKET_ATTACHMENT;
        case r'DELETE_TICKET_ATTACHMENT': return PermissionResponseActionEnum.DELETE_TICKET_ATTACHMENT;
        case r'READ_TICKET_SLA_TRACKING': return PermissionResponseActionEnum.READ_TICKET_SLA_TRACKING;
        case r'UPDATE_TICKET_SLA_TRACKING': return PermissionResponseActionEnum.UPDATE_TICKET_SLA_TRACKING;
        case r'DELETE_TICKET_SLA_TRACKING': return PermissionResponseActionEnum.DELETE_TICKET_SLA_TRACKING;
        case r'READ_TICKET_WATCHER': return PermissionResponseActionEnum.READ_TICKET_WATCHER;
        case r'UPDATE_TICKET_WATCHER': return PermissionResponseActionEnum.UPDATE_TICKET_WATCHER;
        case r'DELETE_TICKET_WATCHER': return PermissionResponseActionEnum.DELETE_TICKET_WATCHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PermissionResponseActionEnumTypeTransformer] instance.
  static PermissionResponseActionEnumTypeTransformer? _instance;
}


