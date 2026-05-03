//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class PermissionCreateRequestDTO extends Schema {
  /// Returns a new [PermissionCreateRequestDTO] instance.
  PermissionCreateRequestDTO({
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

  final PermissionCreateRequestDTOTargetTypeEnum? targetType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? targetId;

  final PermissionCreateRequestDTOActionEnum? action;

  /// The factory instance for creating [PermissionCreateRequestDTO] from JSON.
  static const factory = PermissionCreateRequestDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is PermissionCreateRequestDTO &&
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
  String toString() => 'PermissionCreateRequestDTO[userId=$userId, targetType=$targetType, targetId=$targetId, action=$action]';

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

  /// Returns a new [PermissionCreateRequestDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PermissionCreateRequestDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "PermissionCreateRequestDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "PermissionCreateRequestDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PermissionCreateRequestDTO(
        userId: json[r'userId'] is String ? json[r'userId'] as String : null,
        targetType: PermissionCreateRequestDTOTargetTypeEnum.fromJson(json[r'targetType']),
        targetId: json[r'targetId'] is String ? json[r'targetId'] as String : null,
        action: PermissionCreateRequestDTOActionEnum.fromJson(json[r'action']),
      );
    }
    return null;
  }

  static List<PermissionCreateRequestDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionCreateRequestDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionCreateRequestDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PermissionCreateRequestDTO> mapFromJson(dynamic json) {
    final map = <String, PermissionCreateRequestDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PermissionCreateRequestDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PermissionCreateRequestDTO-objects as value to a dart map
  static Map<String, List<PermissionCreateRequestDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PermissionCreateRequestDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PermissionCreateRequestDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [PermissionCreateRequestDTO] instances from JSON data.
class PermissionCreateRequestDTOFactory extends JsonSchemaFactory<PermissionCreateRequestDTO> {
  const PermissionCreateRequestDTOFactory();

  @override
  PermissionCreateRequestDTO fromJson(dynamic json) => PermissionCreateRequestDTO.fromJson(json)!;
}


class PermissionCreateRequestDTOTargetTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const PermissionCreateRequestDTOTargetTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const TENANT_ROOT = PermissionCreateRequestDTOTargetTypeEnum._(r'TENANT_ROOT');
  static const TENANT = PermissionCreateRequestDTOTargetTypeEnum._(r'TENANT');
  static const USER = PermissionCreateRequestDTOTargetTypeEnum._(r'USER');
  static const STOCK_RESOURCE = PermissionCreateRequestDTOTargetTypeEnum._(r'STOCK_RESOURCE');
  static const EMPLOYEE = PermissionCreateRequestDTOTargetTypeEnum._(r'EMPLOYEE');
  static const TICKET = PermissionCreateRequestDTOTargetTypeEnum._(r'TICKET');
  static const TICKET_HISTORY = PermissionCreateRequestDTOTargetTypeEnum._(r'TICKET_HISTORY');
  static const TICKET_COMMENT = PermissionCreateRequestDTOTargetTypeEnum._(r'TICKET_COMMENT');
  static const TICKET_ASSIGNMENT = PermissionCreateRequestDTOTargetTypeEnum._(r'TICKET_ASSIGNMENT');
  static const TICKET_ATTACHMENT = PermissionCreateRequestDTOTargetTypeEnum._(r'TICKET_ATTACHMENT');
  static const TICKET_SLA_TRACKING = PermissionCreateRequestDTOTargetTypeEnum._(r'TICKET_SLA_TRACKING');
  static const TICKET_WATCHER = PermissionCreateRequestDTOTargetTypeEnum._(r'TICKET_WATCHER');
  static const TEAM = PermissionCreateRequestDTOTargetTypeEnum._(r'TEAM');
  static const TEAM_MEMBER = PermissionCreateRequestDTOTargetTypeEnum._(r'TEAM_MEMBER');
  static const SHOP = PermissionCreateRequestDTOTargetTypeEnum._(r'SHOP');

  /// List of all possible values in this [enum][PermissionCreateRequestDTOTargetTypeEnum].
  static const values = <PermissionCreateRequestDTOTargetTypeEnum>[
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

  static PermissionCreateRequestDTOTargetTypeEnum? fromJson(dynamic value) => PermissionCreateRequestDTOTargetTypeEnumTypeTransformer().decode(value);

  static List<PermissionCreateRequestDTOTargetTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionCreateRequestDTOTargetTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionCreateRequestDTOTargetTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PermissionCreateRequestDTOTargetTypeEnum] to String,
/// and [decode] dynamic data back to [PermissionCreateRequestDTOTargetTypeEnum].
class PermissionCreateRequestDTOTargetTypeEnumTypeTransformer {
  factory PermissionCreateRequestDTOTargetTypeEnumTypeTransformer() => _instance ??= const PermissionCreateRequestDTOTargetTypeEnumTypeTransformer._();

  const PermissionCreateRequestDTOTargetTypeEnumTypeTransformer._();

  String encode(PermissionCreateRequestDTOTargetTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a PermissionCreateRequestDTOTargetTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PermissionCreateRequestDTOTargetTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'TENANT_ROOT': return PermissionCreateRequestDTOTargetTypeEnum.TENANT_ROOT;
        case r'TENANT': return PermissionCreateRequestDTOTargetTypeEnum.TENANT;
        case r'USER': return PermissionCreateRequestDTOTargetTypeEnum.USER;
        case r'STOCK_RESOURCE': return PermissionCreateRequestDTOTargetTypeEnum.STOCK_RESOURCE;
        case r'EMPLOYEE': return PermissionCreateRequestDTOTargetTypeEnum.EMPLOYEE;
        case r'TICKET': return PermissionCreateRequestDTOTargetTypeEnum.TICKET;
        case r'TICKET_HISTORY': return PermissionCreateRequestDTOTargetTypeEnum.TICKET_HISTORY;
        case r'TICKET_COMMENT': return PermissionCreateRequestDTOTargetTypeEnum.TICKET_COMMENT;
        case r'TICKET_ASSIGNMENT': return PermissionCreateRequestDTOTargetTypeEnum.TICKET_ASSIGNMENT;
        case r'TICKET_ATTACHMENT': return PermissionCreateRequestDTOTargetTypeEnum.TICKET_ATTACHMENT;
        case r'TICKET_SLA_TRACKING': return PermissionCreateRequestDTOTargetTypeEnum.TICKET_SLA_TRACKING;
        case r'TICKET_WATCHER': return PermissionCreateRequestDTOTargetTypeEnum.TICKET_WATCHER;
        case r'TEAM': return PermissionCreateRequestDTOTargetTypeEnum.TEAM;
        case r'TEAM_MEMBER': return PermissionCreateRequestDTOTargetTypeEnum.TEAM_MEMBER;
        case r'SHOP': return PermissionCreateRequestDTOTargetTypeEnum.SHOP;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PermissionCreateRequestDTOTargetTypeEnumTypeTransformer] instance.
  static PermissionCreateRequestDTOTargetTypeEnumTypeTransformer? _instance;
}



class PermissionCreateRequestDTOActionEnum {
  /// Instantiate a new enum with the provided [value].
  const PermissionCreateRequestDTOActionEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const CREATE_TEAM = PermissionCreateRequestDTOActionEnum._(r'CREATE_TEAM');
  static const ADMIN_TENANT = PermissionCreateRequestDTOActionEnum._(r'ADMIN_TENANT');
  static const UPDATE_TENANT = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TENANT');
  static const READ_TENANT = PermissionCreateRequestDTOActionEnum._(r'READ_TENANT');
  static const CREATE_STOCK_RESOURCE = PermissionCreateRequestDTOActionEnum._(r'CREATE_STOCK_RESOURCE');
  static const CREATE_EMPLOYEE = PermissionCreateRequestDTOActionEnum._(r'CREATE_EMPLOYEE');
  static const CREATE_TICKET = PermissionCreateRequestDTOActionEnum._(r'CREATE_TICKET');
  static const READ_USER = PermissionCreateRequestDTOActionEnum._(r'READ_USER');
  static const READ_PERMISSION = PermissionCreateRequestDTOActionEnum._(r'READ_PERMISSION');
  static const ADMIN_STOCK_RESOURCE = PermissionCreateRequestDTOActionEnum._(r'ADMIN_STOCK_RESOURCE');
  static const UPDATE_STOCK_RESOURCE = PermissionCreateRequestDTOActionEnum._(r'UPDATE_STOCK_RESOURCE');
  static const DELETE_STOCK_RESOURCE = PermissionCreateRequestDTOActionEnum._(r'DELETE_STOCK_RESOURCE');
  static const READ_STOCK_RESOURCE = PermissionCreateRequestDTOActionEnum._(r'READ_STOCK_RESOURCE');
  static const READ_EMPLOYEE = PermissionCreateRequestDTOActionEnum._(r'READ_EMPLOYEE');
  static const UPDATE_EMPLOYEE = PermissionCreateRequestDTOActionEnum._(r'UPDATE_EMPLOYEE');
  static const DELETE_EMPLOYEE = PermissionCreateRequestDTOActionEnum._(r'DELETE_EMPLOYEE');
  static const READ_TEAM = PermissionCreateRequestDTOActionEnum._(r'READ_TEAM');
  static const UPDATE_TEAM = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TEAM');
  static const DELETE_TEAM = PermissionCreateRequestDTOActionEnum._(r'DELETE_TEAM');
  static const CREATE_TEAM_MEMBER = PermissionCreateRequestDTOActionEnum._(r'CREATE_TEAM_MEMBER');
  static const READ_TEAM_MEMBER = PermissionCreateRequestDTOActionEnum._(r'READ_TEAM_MEMBER');
  static const UPDATE_TEAM_MEMBER = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TEAM_MEMBER');
  static const DELETE_TEAM_MEMBER = PermissionCreateRequestDTOActionEnum._(r'DELETE_TEAM_MEMBER');
  static const READ_TICKET = PermissionCreateRequestDTOActionEnum._(r'READ_TICKET');
  static const UPDATE_TICKET = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TICKET');
  static const DELETE_TICKET = PermissionCreateRequestDTOActionEnum._(r'DELETE_TICKET');
  static const CREATE_TICKET_HISTORY = PermissionCreateRequestDTOActionEnum._(r'CREATE_TICKET_HISTORY');
  static const CREATE_TICKET_COMMENT = PermissionCreateRequestDTOActionEnum._(r'CREATE_TICKET_COMMENT');
  static const CREATE_TICKET_ASSIGNMENT = PermissionCreateRequestDTOActionEnum._(r'CREATE_TICKET_ASSIGNMENT');
  static const CREATE_TICKET_ATTACHMENT = PermissionCreateRequestDTOActionEnum._(r'CREATE_TICKET_ATTACHMENT');
  static const CREATE_TICKET_SLA_TRACKING = PermissionCreateRequestDTOActionEnum._(r'CREATE_TICKET_SLA_TRACKING');
  static const CREATE_TICKET_WATCHER = PermissionCreateRequestDTOActionEnum._(r'CREATE_TICKET_WATCHER');
  static const READ_TICKET_HISTORY = PermissionCreateRequestDTOActionEnum._(r'READ_TICKET_HISTORY');
  static const UPDATE_TICKET_HISTORY = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TICKET_HISTORY');
  static const DELETE_TICKET_HISTORY = PermissionCreateRequestDTOActionEnum._(r'DELETE_TICKET_HISTORY');
  static const READ_TICKET_COMMENT = PermissionCreateRequestDTOActionEnum._(r'READ_TICKET_COMMENT');
  static const UPDATE_TICKET_COMMENT = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TICKET_COMMENT');
  static const DELETE_TICKET_COMMENT = PermissionCreateRequestDTOActionEnum._(r'DELETE_TICKET_COMMENT');
  static const READ_TICKET_ASSIGNMENT = PermissionCreateRequestDTOActionEnum._(r'READ_TICKET_ASSIGNMENT');
  static const UPDATE_TICKET_ASSIGNMENT = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TICKET_ASSIGNMENT');
  static const DELETE_TICKET_ASSIGNMENT = PermissionCreateRequestDTOActionEnum._(r'DELETE_TICKET_ASSIGNMENT');
  static const READ_TICKET_ATTACHMENT = PermissionCreateRequestDTOActionEnum._(r'READ_TICKET_ATTACHMENT');
  static const UPDATE_TICKET_ATTACHMENT = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TICKET_ATTACHMENT');
  static const DELETE_TICKET_ATTACHMENT = PermissionCreateRequestDTOActionEnum._(r'DELETE_TICKET_ATTACHMENT');
  static const READ_TICKET_SLA_TRACKING = PermissionCreateRequestDTOActionEnum._(r'READ_TICKET_SLA_TRACKING');
  static const UPDATE_TICKET_SLA_TRACKING = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TICKET_SLA_TRACKING');
  static const DELETE_TICKET_SLA_TRACKING = PermissionCreateRequestDTOActionEnum._(r'DELETE_TICKET_SLA_TRACKING');
  static const READ_TICKET_WATCHER = PermissionCreateRequestDTOActionEnum._(r'READ_TICKET_WATCHER');
  static const UPDATE_TICKET_WATCHER = PermissionCreateRequestDTOActionEnum._(r'UPDATE_TICKET_WATCHER');
  static const DELETE_TICKET_WATCHER = PermissionCreateRequestDTOActionEnum._(r'DELETE_TICKET_WATCHER');

  /// List of all possible values in this [enum][PermissionCreateRequestDTOActionEnum].
  static const values = <PermissionCreateRequestDTOActionEnum>[
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

  static PermissionCreateRequestDTOActionEnum? fromJson(dynamic value) => PermissionCreateRequestDTOActionEnumTypeTransformer().decode(value);

  static List<PermissionCreateRequestDTOActionEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionCreateRequestDTOActionEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionCreateRequestDTOActionEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PermissionCreateRequestDTOActionEnum] to String,
/// and [decode] dynamic data back to [PermissionCreateRequestDTOActionEnum].
class PermissionCreateRequestDTOActionEnumTypeTransformer {
  factory PermissionCreateRequestDTOActionEnumTypeTransformer() => _instance ??= const PermissionCreateRequestDTOActionEnumTypeTransformer._();

  const PermissionCreateRequestDTOActionEnumTypeTransformer._();

  String encode(PermissionCreateRequestDTOActionEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a PermissionCreateRequestDTOActionEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PermissionCreateRequestDTOActionEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'CREATE_TEAM': return PermissionCreateRequestDTOActionEnum.CREATE_TEAM;
        case r'ADMIN_TENANT': return PermissionCreateRequestDTOActionEnum.ADMIN_TENANT;
        case r'UPDATE_TENANT': return PermissionCreateRequestDTOActionEnum.UPDATE_TENANT;
        case r'READ_TENANT': return PermissionCreateRequestDTOActionEnum.READ_TENANT;
        case r'CREATE_STOCK_RESOURCE': return PermissionCreateRequestDTOActionEnum.CREATE_STOCK_RESOURCE;
        case r'CREATE_EMPLOYEE': return PermissionCreateRequestDTOActionEnum.CREATE_EMPLOYEE;
        case r'CREATE_TICKET': return PermissionCreateRequestDTOActionEnum.CREATE_TICKET;
        case r'READ_USER': return PermissionCreateRequestDTOActionEnum.READ_USER;
        case r'READ_PERMISSION': return PermissionCreateRequestDTOActionEnum.READ_PERMISSION;
        case r'ADMIN_STOCK_RESOURCE': return PermissionCreateRequestDTOActionEnum.ADMIN_STOCK_RESOURCE;
        case r'UPDATE_STOCK_RESOURCE': return PermissionCreateRequestDTOActionEnum.UPDATE_STOCK_RESOURCE;
        case r'DELETE_STOCK_RESOURCE': return PermissionCreateRequestDTOActionEnum.DELETE_STOCK_RESOURCE;
        case r'READ_STOCK_RESOURCE': return PermissionCreateRequestDTOActionEnum.READ_STOCK_RESOURCE;
        case r'READ_EMPLOYEE': return PermissionCreateRequestDTOActionEnum.READ_EMPLOYEE;
        case r'UPDATE_EMPLOYEE': return PermissionCreateRequestDTOActionEnum.UPDATE_EMPLOYEE;
        case r'DELETE_EMPLOYEE': return PermissionCreateRequestDTOActionEnum.DELETE_EMPLOYEE;
        case r'READ_TEAM': return PermissionCreateRequestDTOActionEnum.READ_TEAM;
        case r'UPDATE_TEAM': return PermissionCreateRequestDTOActionEnum.UPDATE_TEAM;
        case r'DELETE_TEAM': return PermissionCreateRequestDTOActionEnum.DELETE_TEAM;
        case r'CREATE_TEAM_MEMBER': return PermissionCreateRequestDTOActionEnum.CREATE_TEAM_MEMBER;
        case r'READ_TEAM_MEMBER': return PermissionCreateRequestDTOActionEnum.READ_TEAM_MEMBER;
        case r'UPDATE_TEAM_MEMBER': return PermissionCreateRequestDTOActionEnum.UPDATE_TEAM_MEMBER;
        case r'DELETE_TEAM_MEMBER': return PermissionCreateRequestDTOActionEnum.DELETE_TEAM_MEMBER;
        case r'READ_TICKET': return PermissionCreateRequestDTOActionEnum.READ_TICKET;
        case r'UPDATE_TICKET': return PermissionCreateRequestDTOActionEnum.UPDATE_TICKET;
        case r'DELETE_TICKET': return PermissionCreateRequestDTOActionEnum.DELETE_TICKET;
        case r'CREATE_TICKET_HISTORY': return PermissionCreateRequestDTOActionEnum.CREATE_TICKET_HISTORY;
        case r'CREATE_TICKET_COMMENT': return PermissionCreateRequestDTOActionEnum.CREATE_TICKET_COMMENT;
        case r'CREATE_TICKET_ASSIGNMENT': return PermissionCreateRequestDTOActionEnum.CREATE_TICKET_ASSIGNMENT;
        case r'CREATE_TICKET_ATTACHMENT': return PermissionCreateRequestDTOActionEnum.CREATE_TICKET_ATTACHMENT;
        case r'CREATE_TICKET_SLA_TRACKING': return PermissionCreateRequestDTOActionEnum.CREATE_TICKET_SLA_TRACKING;
        case r'CREATE_TICKET_WATCHER': return PermissionCreateRequestDTOActionEnum.CREATE_TICKET_WATCHER;
        case r'READ_TICKET_HISTORY': return PermissionCreateRequestDTOActionEnum.READ_TICKET_HISTORY;
        case r'UPDATE_TICKET_HISTORY': return PermissionCreateRequestDTOActionEnum.UPDATE_TICKET_HISTORY;
        case r'DELETE_TICKET_HISTORY': return PermissionCreateRequestDTOActionEnum.DELETE_TICKET_HISTORY;
        case r'READ_TICKET_COMMENT': return PermissionCreateRequestDTOActionEnum.READ_TICKET_COMMENT;
        case r'UPDATE_TICKET_COMMENT': return PermissionCreateRequestDTOActionEnum.UPDATE_TICKET_COMMENT;
        case r'DELETE_TICKET_COMMENT': return PermissionCreateRequestDTOActionEnum.DELETE_TICKET_COMMENT;
        case r'READ_TICKET_ASSIGNMENT': return PermissionCreateRequestDTOActionEnum.READ_TICKET_ASSIGNMENT;
        case r'UPDATE_TICKET_ASSIGNMENT': return PermissionCreateRequestDTOActionEnum.UPDATE_TICKET_ASSIGNMENT;
        case r'DELETE_TICKET_ASSIGNMENT': return PermissionCreateRequestDTOActionEnum.DELETE_TICKET_ASSIGNMENT;
        case r'READ_TICKET_ATTACHMENT': return PermissionCreateRequestDTOActionEnum.READ_TICKET_ATTACHMENT;
        case r'UPDATE_TICKET_ATTACHMENT': return PermissionCreateRequestDTOActionEnum.UPDATE_TICKET_ATTACHMENT;
        case r'DELETE_TICKET_ATTACHMENT': return PermissionCreateRequestDTOActionEnum.DELETE_TICKET_ATTACHMENT;
        case r'READ_TICKET_SLA_TRACKING': return PermissionCreateRequestDTOActionEnum.READ_TICKET_SLA_TRACKING;
        case r'UPDATE_TICKET_SLA_TRACKING': return PermissionCreateRequestDTOActionEnum.UPDATE_TICKET_SLA_TRACKING;
        case r'DELETE_TICKET_SLA_TRACKING': return PermissionCreateRequestDTOActionEnum.DELETE_TICKET_SLA_TRACKING;
        case r'READ_TICKET_WATCHER': return PermissionCreateRequestDTOActionEnum.READ_TICKET_WATCHER;
        case r'UPDATE_TICKET_WATCHER': return PermissionCreateRequestDTOActionEnum.UPDATE_TICKET_WATCHER;
        case r'DELETE_TICKET_WATCHER': return PermissionCreateRequestDTOActionEnum.DELETE_TICKET_WATCHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PermissionCreateRequestDTOActionEnumTypeTransformer] instance.
  static PermissionCreateRequestDTOActionEnumTypeTransformer? _instance;
}


