//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class PermissionUpdateRequest extends Schema {
  /// Returns a new [PermissionUpdateRequest] instance.
  PermissionUpdateRequest({
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
  final String? userId;

  final PermissionUpdateRequestTargetTypeEnum? targetType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? targetId;

  final PermissionUpdateRequestActionEnum? action;

  /// The factory instance for creating [PermissionUpdateRequest] from JSON.
  static const factory = PermissionUpdateRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is PermissionUpdateRequest &&
    other.userId == userId &&
    other.targetType == targetType &&
    other.targetId == targetId &&
    other.action == action;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (userId == null ? 0 : userId!.hashCode) +
    (targetType == null ? 0 : targetType!.hashCode) +
    (targetId == null ? 0 : targetId!.hashCode) +
    (action == null ? 0 : action!.hashCode);

  @override
  String toString() => 'PermissionUpdateRequest[userId=$userId, targetType=$targetType, targetId=$targetId, action=$action]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
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

  /// Returns a new [PermissionUpdateRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PermissionUpdateRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "PermissionUpdateRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "PermissionUpdateRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PermissionUpdateRequest(
        userId: json[r'userId'] is String ? json[r'userId'] as String : null,
        targetType: PermissionUpdateRequestTargetTypeEnum.fromJson(json[r'targetType']),
        targetId: json[r'targetId'] is String ? json[r'targetId'] as String : null,
        action: PermissionUpdateRequestActionEnum.fromJson(json[r'action']),
      );
    }
    return null;
  }

  static List<PermissionUpdateRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionUpdateRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionUpdateRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PermissionUpdateRequest> mapFromJson(dynamic json) {
    final map = <String, PermissionUpdateRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PermissionUpdateRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PermissionUpdateRequest-objects as value to a dart map
  static Map<String, List<PermissionUpdateRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PermissionUpdateRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PermissionUpdateRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [PermissionUpdateRequest] instances from JSON data.
class PermissionUpdateRequestFactory extends JsonSchemaFactory<PermissionUpdateRequest> {
  const PermissionUpdateRequestFactory();

  @override
  PermissionUpdateRequest fromJson(dynamic json) => PermissionUpdateRequest.fromJson(json)!;
}


class PermissionUpdateRequestTargetTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const PermissionUpdateRequestTargetTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const TENANT_ROOT = PermissionUpdateRequestTargetTypeEnum._(r'TENANT_ROOT');
  static const TENANT = PermissionUpdateRequestTargetTypeEnum._(r'TENANT');
  static const USER = PermissionUpdateRequestTargetTypeEnum._(r'USER');
  static const STOCK_RESOURCE = PermissionUpdateRequestTargetTypeEnum._(r'STOCK_RESOURCE');
  static const EMPLOYEE = PermissionUpdateRequestTargetTypeEnum._(r'EMPLOYEE');
  static const TICKET = PermissionUpdateRequestTargetTypeEnum._(r'TICKET');
  static const TICKET_HISTORY = PermissionUpdateRequestTargetTypeEnum._(r'TICKET_HISTORY');
  static const TICKET_COMMENT = PermissionUpdateRequestTargetTypeEnum._(r'TICKET_COMMENT');
  static const TICKET_ASSIGNMENT = PermissionUpdateRequestTargetTypeEnum._(r'TICKET_ASSIGNMENT');
  static const TICKET_ATTACHMENT = PermissionUpdateRequestTargetTypeEnum._(r'TICKET_ATTACHMENT');
  static const TICKET_SLA_TRACKING = PermissionUpdateRequestTargetTypeEnum._(r'TICKET_SLA_TRACKING');
  static const TICKET_WATCHER = PermissionUpdateRequestTargetTypeEnum._(r'TICKET_WATCHER');
  static const TEAM = PermissionUpdateRequestTargetTypeEnum._(r'TEAM');
  static const TEAM_MEMBER = PermissionUpdateRequestTargetTypeEnum._(r'TEAM_MEMBER');
  static const SHOP = PermissionUpdateRequestTargetTypeEnum._(r'SHOP');

  /// List of all possible values in this [enum][PermissionUpdateRequestTargetTypeEnum].
  static const values = <PermissionUpdateRequestTargetTypeEnum>[
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

  static PermissionUpdateRequestTargetTypeEnum? fromJson(dynamic value) => PermissionUpdateRequestTargetTypeEnumTypeTransformer().decode(value);

  static List<PermissionUpdateRequestTargetTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionUpdateRequestTargetTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionUpdateRequestTargetTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PermissionUpdateRequestTargetTypeEnum] to String,
/// and [decode] dynamic data back to [PermissionUpdateRequestTargetTypeEnum].
class PermissionUpdateRequestTargetTypeEnumTypeTransformer {
  factory PermissionUpdateRequestTargetTypeEnumTypeTransformer() => _instance ??= const PermissionUpdateRequestTargetTypeEnumTypeTransformer._();

  const PermissionUpdateRequestTargetTypeEnumTypeTransformer._();

  String encode(PermissionUpdateRequestTargetTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a PermissionUpdateRequestTargetTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PermissionUpdateRequestTargetTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'TENANT_ROOT': return PermissionUpdateRequestTargetTypeEnum.TENANT_ROOT;
        case r'TENANT': return PermissionUpdateRequestTargetTypeEnum.TENANT;
        case r'USER': return PermissionUpdateRequestTargetTypeEnum.USER;
        case r'STOCK_RESOURCE': return PermissionUpdateRequestTargetTypeEnum.STOCK_RESOURCE;
        case r'EMPLOYEE': return PermissionUpdateRequestTargetTypeEnum.EMPLOYEE;
        case r'TICKET': return PermissionUpdateRequestTargetTypeEnum.TICKET;
        case r'TICKET_HISTORY': return PermissionUpdateRequestTargetTypeEnum.TICKET_HISTORY;
        case r'TICKET_COMMENT': return PermissionUpdateRequestTargetTypeEnum.TICKET_COMMENT;
        case r'TICKET_ASSIGNMENT': return PermissionUpdateRequestTargetTypeEnum.TICKET_ASSIGNMENT;
        case r'TICKET_ATTACHMENT': return PermissionUpdateRequestTargetTypeEnum.TICKET_ATTACHMENT;
        case r'TICKET_SLA_TRACKING': return PermissionUpdateRequestTargetTypeEnum.TICKET_SLA_TRACKING;
        case r'TICKET_WATCHER': return PermissionUpdateRequestTargetTypeEnum.TICKET_WATCHER;
        case r'TEAM': return PermissionUpdateRequestTargetTypeEnum.TEAM;
        case r'TEAM_MEMBER': return PermissionUpdateRequestTargetTypeEnum.TEAM_MEMBER;
        case r'SHOP': return PermissionUpdateRequestTargetTypeEnum.SHOP;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PermissionUpdateRequestTargetTypeEnumTypeTransformer] instance.
  static PermissionUpdateRequestTargetTypeEnumTypeTransformer? _instance;
}



class PermissionUpdateRequestActionEnum {
  /// Instantiate a new enum with the provided [value].
  const PermissionUpdateRequestActionEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const CREATE_TEAM = PermissionUpdateRequestActionEnum._(r'CREATE_TEAM');
  static const ADMIN_TENANT = PermissionUpdateRequestActionEnum._(r'ADMIN_TENANT');
  static const UPDATE_TENANT = PermissionUpdateRequestActionEnum._(r'UPDATE_TENANT');
  static const READ_TENANT = PermissionUpdateRequestActionEnum._(r'READ_TENANT');
  static const CREATE_STOCK_RESOURCE = PermissionUpdateRequestActionEnum._(r'CREATE_STOCK_RESOURCE');
  static const CREATE_EMPLOYEE = PermissionUpdateRequestActionEnum._(r'CREATE_EMPLOYEE');
  static const CREATE_TICKET = PermissionUpdateRequestActionEnum._(r'CREATE_TICKET');
  static const READ_USER = PermissionUpdateRequestActionEnum._(r'READ_USER');
  static const READ_PERMISSION = PermissionUpdateRequestActionEnum._(r'READ_PERMISSION');
  static const ADMIN_STOCK_RESOURCE = PermissionUpdateRequestActionEnum._(r'ADMIN_STOCK_RESOURCE');
  static const UPDATE_STOCK_RESOURCE = PermissionUpdateRequestActionEnum._(r'UPDATE_STOCK_RESOURCE');
  static const DELETE_STOCK_RESOURCE = PermissionUpdateRequestActionEnum._(r'DELETE_STOCK_RESOURCE');
  static const READ_STOCK_RESOURCE = PermissionUpdateRequestActionEnum._(r'READ_STOCK_RESOURCE');
  static const READ_EMPLOYEE = PermissionUpdateRequestActionEnum._(r'READ_EMPLOYEE');
  static const UPDATE_EMPLOYEE = PermissionUpdateRequestActionEnum._(r'UPDATE_EMPLOYEE');
  static const DELETE_EMPLOYEE = PermissionUpdateRequestActionEnum._(r'DELETE_EMPLOYEE');
  static const READ_TEAM = PermissionUpdateRequestActionEnum._(r'READ_TEAM');
  static const UPDATE_TEAM = PermissionUpdateRequestActionEnum._(r'UPDATE_TEAM');
  static const DELETE_TEAM = PermissionUpdateRequestActionEnum._(r'DELETE_TEAM');
  static const CREATE_TEAM_MEMBER = PermissionUpdateRequestActionEnum._(r'CREATE_TEAM_MEMBER');
  static const READ_TEAM_MEMBER = PermissionUpdateRequestActionEnum._(r'READ_TEAM_MEMBER');
  static const UPDATE_TEAM_MEMBER = PermissionUpdateRequestActionEnum._(r'UPDATE_TEAM_MEMBER');
  static const DELETE_TEAM_MEMBER = PermissionUpdateRequestActionEnum._(r'DELETE_TEAM_MEMBER');
  static const READ_TICKET = PermissionUpdateRequestActionEnum._(r'READ_TICKET');
  static const UPDATE_TICKET = PermissionUpdateRequestActionEnum._(r'UPDATE_TICKET');
  static const DELETE_TICKET = PermissionUpdateRequestActionEnum._(r'DELETE_TICKET');
  static const CREATE_TICKET_HISTORY = PermissionUpdateRequestActionEnum._(r'CREATE_TICKET_HISTORY');
  static const CREATE_TICKET_COMMENT = PermissionUpdateRequestActionEnum._(r'CREATE_TICKET_COMMENT');
  static const CREATE_TICKET_ASSIGNMENT = PermissionUpdateRequestActionEnum._(r'CREATE_TICKET_ASSIGNMENT');
  static const CREATE_TICKET_ATTACHMENT = PermissionUpdateRequestActionEnum._(r'CREATE_TICKET_ATTACHMENT');
  static const CREATE_TICKET_SLA_TRACKING = PermissionUpdateRequestActionEnum._(r'CREATE_TICKET_SLA_TRACKING');
  static const CREATE_TICKET_WATCHER = PermissionUpdateRequestActionEnum._(r'CREATE_TICKET_WATCHER');
  static const READ_TICKET_HISTORY = PermissionUpdateRequestActionEnum._(r'READ_TICKET_HISTORY');
  static const UPDATE_TICKET_HISTORY = PermissionUpdateRequestActionEnum._(r'UPDATE_TICKET_HISTORY');
  static const DELETE_TICKET_HISTORY = PermissionUpdateRequestActionEnum._(r'DELETE_TICKET_HISTORY');
  static const READ_TICKET_COMMENT = PermissionUpdateRequestActionEnum._(r'READ_TICKET_COMMENT');
  static const UPDATE_TICKET_COMMENT = PermissionUpdateRequestActionEnum._(r'UPDATE_TICKET_COMMENT');
  static const DELETE_TICKET_COMMENT = PermissionUpdateRequestActionEnum._(r'DELETE_TICKET_COMMENT');
  static const READ_TICKET_ASSIGNMENT = PermissionUpdateRequestActionEnum._(r'READ_TICKET_ASSIGNMENT');
  static const UPDATE_TICKET_ASSIGNMENT = PermissionUpdateRequestActionEnum._(r'UPDATE_TICKET_ASSIGNMENT');
  static const DELETE_TICKET_ASSIGNMENT = PermissionUpdateRequestActionEnum._(r'DELETE_TICKET_ASSIGNMENT');
  static const READ_TICKET_ATTACHMENT = PermissionUpdateRequestActionEnum._(r'READ_TICKET_ATTACHMENT');
  static const UPDATE_TICKET_ATTACHMENT = PermissionUpdateRequestActionEnum._(r'UPDATE_TICKET_ATTACHMENT');
  static const DELETE_TICKET_ATTACHMENT = PermissionUpdateRequestActionEnum._(r'DELETE_TICKET_ATTACHMENT');
  static const READ_TICKET_SLA_TRACKING = PermissionUpdateRequestActionEnum._(r'READ_TICKET_SLA_TRACKING');
  static const UPDATE_TICKET_SLA_TRACKING = PermissionUpdateRequestActionEnum._(r'UPDATE_TICKET_SLA_TRACKING');
  static const DELETE_TICKET_SLA_TRACKING = PermissionUpdateRequestActionEnum._(r'DELETE_TICKET_SLA_TRACKING');
  static const READ_TICKET_WATCHER = PermissionUpdateRequestActionEnum._(r'READ_TICKET_WATCHER');
  static const UPDATE_TICKET_WATCHER = PermissionUpdateRequestActionEnum._(r'UPDATE_TICKET_WATCHER');
  static const DELETE_TICKET_WATCHER = PermissionUpdateRequestActionEnum._(r'DELETE_TICKET_WATCHER');

  /// List of all possible values in this [enum][PermissionUpdateRequestActionEnum].
  static const values = <PermissionUpdateRequestActionEnum>[
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

  static PermissionUpdateRequestActionEnum? fromJson(dynamic value) => PermissionUpdateRequestActionEnumTypeTransformer().decode(value);

  static List<PermissionUpdateRequestActionEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionUpdateRequestActionEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionUpdateRequestActionEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PermissionUpdateRequestActionEnum] to String,
/// and [decode] dynamic data back to [PermissionUpdateRequestActionEnum].
class PermissionUpdateRequestActionEnumTypeTransformer {
  factory PermissionUpdateRequestActionEnumTypeTransformer() => _instance ??= const PermissionUpdateRequestActionEnumTypeTransformer._();

  const PermissionUpdateRequestActionEnumTypeTransformer._();

  String encode(PermissionUpdateRequestActionEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a PermissionUpdateRequestActionEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PermissionUpdateRequestActionEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'CREATE_TEAM': return PermissionUpdateRequestActionEnum.CREATE_TEAM;
        case r'ADMIN_TENANT': return PermissionUpdateRequestActionEnum.ADMIN_TENANT;
        case r'UPDATE_TENANT': return PermissionUpdateRequestActionEnum.UPDATE_TENANT;
        case r'READ_TENANT': return PermissionUpdateRequestActionEnum.READ_TENANT;
        case r'CREATE_STOCK_RESOURCE': return PermissionUpdateRequestActionEnum.CREATE_STOCK_RESOURCE;
        case r'CREATE_EMPLOYEE': return PermissionUpdateRequestActionEnum.CREATE_EMPLOYEE;
        case r'CREATE_TICKET': return PermissionUpdateRequestActionEnum.CREATE_TICKET;
        case r'READ_USER': return PermissionUpdateRequestActionEnum.READ_USER;
        case r'READ_PERMISSION': return PermissionUpdateRequestActionEnum.READ_PERMISSION;
        case r'ADMIN_STOCK_RESOURCE': return PermissionUpdateRequestActionEnum.ADMIN_STOCK_RESOURCE;
        case r'UPDATE_STOCK_RESOURCE': return PermissionUpdateRequestActionEnum.UPDATE_STOCK_RESOURCE;
        case r'DELETE_STOCK_RESOURCE': return PermissionUpdateRequestActionEnum.DELETE_STOCK_RESOURCE;
        case r'READ_STOCK_RESOURCE': return PermissionUpdateRequestActionEnum.READ_STOCK_RESOURCE;
        case r'READ_EMPLOYEE': return PermissionUpdateRequestActionEnum.READ_EMPLOYEE;
        case r'UPDATE_EMPLOYEE': return PermissionUpdateRequestActionEnum.UPDATE_EMPLOYEE;
        case r'DELETE_EMPLOYEE': return PermissionUpdateRequestActionEnum.DELETE_EMPLOYEE;
        case r'READ_TEAM': return PermissionUpdateRequestActionEnum.READ_TEAM;
        case r'UPDATE_TEAM': return PermissionUpdateRequestActionEnum.UPDATE_TEAM;
        case r'DELETE_TEAM': return PermissionUpdateRequestActionEnum.DELETE_TEAM;
        case r'CREATE_TEAM_MEMBER': return PermissionUpdateRequestActionEnum.CREATE_TEAM_MEMBER;
        case r'READ_TEAM_MEMBER': return PermissionUpdateRequestActionEnum.READ_TEAM_MEMBER;
        case r'UPDATE_TEAM_MEMBER': return PermissionUpdateRequestActionEnum.UPDATE_TEAM_MEMBER;
        case r'DELETE_TEAM_MEMBER': return PermissionUpdateRequestActionEnum.DELETE_TEAM_MEMBER;
        case r'READ_TICKET': return PermissionUpdateRequestActionEnum.READ_TICKET;
        case r'UPDATE_TICKET': return PermissionUpdateRequestActionEnum.UPDATE_TICKET;
        case r'DELETE_TICKET': return PermissionUpdateRequestActionEnum.DELETE_TICKET;
        case r'CREATE_TICKET_HISTORY': return PermissionUpdateRequestActionEnum.CREATE_TICKET_HISTORY;
        case r'CREATE_TICKET_COMMENT': return PermissionUpdateRequestActionEnum.CREATE_TICKET_COMMENT;
        case r'CREATE_TICKET_ASSIGNMENT': return PermissionUpdateRequestActionEnum.CREATE_TICKET_ASSIGNMENT;
        case r'CREATE_TICKET_ATTACHMENT': return PermissionUpdateRequestActionEnum.CREATE_TICKET_ATTACHMENT;
        case r'CREATE_TICKET_SLA_TRACKING': return PermissionUpdateRequestActionEnum.CREATE_TICKET_SLA_TRACKING;
        case r'CREATE_TICKET_WATCHER': return PermissionUpdateRequestActionEnum.CREATE_TICKET_WATCHER;
        case r'READ_TICKET_HISTORY': return PermissionUpdateRequestActionEnum.READ_TICKET_HISTORY;
        case r'UPDATE_TICKET_HISTORY': return PermissionUpdateRequestActionEnum.UPDATE_TICKET_HISTORY;
        case r'DELETE_TICKET_HISTORY': return PermissionUpdateRequestActionEnum.DELETE_TICKET_HISTORY;
        case r'READ_TICKET_COMMENT': return PermissionUpdateRequestActionEnum.READ_TICKET_COMMENT;
        case r'UPDATE_TICKET_COMMENT': return PermissionUpdateRequestActionEnum.UPDATE_TICKET_COMMENT;
        case r'DELETE_TICKET_COMMENT': return PermissionUpdateRequestActionEnum.DELETE_TICKET_COMMENT;
        case r'READ_TICKET_ASSIGNMENT': return PermissionUpdateRequestActionEnum.READ_TICKET_ASSIGNMENT;
        case r'UPDATE_TICKET_ASSIGNMENT': return PermissionUpdateRequestActionEnum.UPDATE_TICKET_ASSIGNMENT;
        case r'DELETE_TICKET_ASSIGNMENT': return PermissionUpdateRequestActionEnum.DELETE_TICKET_ASSIGNMENT;
        case r'READ_TICKET_ATTACHMENT': return PermissionUpdateRequestActionEnum.READ_TICKET_ATTACHMENT;
        case r'UPDATE_TICKET_ATTACHMENT': return PermissionUpdateRequestActionEnum.UPDATE_TICKET_ATTACHMENT;
        case r'DELETE_TICKET_ATTACHMENT': return PermissionUpdateRequestActionEnum.DELETE_TICKET_ATTACHMENT;
        case r'READ_TICKET_SLA_TRACKING': return PermissionUpdateRequestActionEnum.READ_TICKET_SLA_TRACKING;
        case r'UPDATE_TICKET_SLA_TRACKING': return PermissionUpdateRequestActionEnum.UPDATE_TICKET_SLA_TRACKING;
        case r'DELETE_TICKET_SLA_TRACKING': return PermissionUpdateRequestActionEnum.DELETE_TICKET_SLA_TRACKING;
        case r'READ_TICKET_WATCHER': return PermissionUpdateRequestActionEnum.READ_TICKET_WATCHER;
        case r'UPDATE_TICKET_WATCHER': return PermissionUpdateRequestActionEnum.UPDATE_TICKET_WATCHER;
        case r'DELETE_TICKET_WATCHER': return PermissionUpdateRequestActionEnum.DELETE_TICKET_WATCHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PermissionUpdateRequestActionEnumTypeTransformer] instance.
  static PermissionUpdateRequestActionEnumTypeTransformer? _instance;
}


