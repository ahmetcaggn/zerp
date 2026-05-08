//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'meta.dart';
import 'parameter.dart';

class ApiResponseListPermissionAction extends Schema {
  /// Returns a new [ApiResponseListPermissionAction] instance.
  ApiResponseListPermissionAction({
    this.success,
    this.statusCode,
    this.message,
    this.data = const [],
    this.meta,
    this.parameters = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? success;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? statusCode;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? message;

  final List<ApiResponseListPermissionActionDataEnum> data;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final Meta? meta;

  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseListPermissionAction] from JSON.
  static const factory = ApiResponseListPermissionActionFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ApiResponseListPermissionAction &&
    other.success == success &&
    other.statusCode == statusCode &&
    other.message == message &&
    other.data == data &&
    other.meta == meta &&
    other.parameters == parameters;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (success == null ? 0 : success!.hashCode) +
    (statusCode == null ? 0 : statusCode!.hashCode) +
    (message == null ? 0 : message!.hashCode) +
    (data.hashCode) +
    (meta == null ? 0 : meta!.hashCode) +
    (parameters.hashCode);

  @override
  String toString() => 'ApiResponseListPermissionAction[success=$success, statusCode=$statusCode, message=$message, data=$data, meta=$meta, parameters=$parameters]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.success != null) {
      json[r'success'] = this.success;
    } else {
      json[r'success'] = null;
    }
    if (this.statusCode != null) {
      json[r'statusCode'] = this.statusCode;
    } else {
      json[r'statusCode'] = null;
    }
    if (this.message != null) {
      json[r'message'] = this.message;
    } else {
      json[r'message'] = null;
    }
      json[r'data'] = this.data;
    if (this.meta != null) {
      json[r'meta'] = this.meta;
    } else {
      json[r'meta'] = null;
    }
      json[r'parameters'] = this.parameters;
    return json;
  }

  /// Returns a new [ApiResponseListPermissionAction] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ApiResponseListPermissionAction? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ApiResponseListPermissionAction[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ApiResponseListPermissionAction[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ApiResponseListPermissionAction(
        success: json[r'success'] is bool ? json[r'success'] as bool : null,
        statusCode: json[r'statusCode'] is int ? json[r'statusCode'] as int : null,
        message: json[r'message'] is String ? json[r'message'] as String : null,
        data: ApiResponseListPermissionActionDataEnum.listFromJson(json[r'data']),
        meta: Meta.fromJson(json[r'meta']),
        parameters: Parameter.listFromJson(json[r'parameters']),
      );
    }
    return null;
  }

  static List<ApiResponseListPermissionAction> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseListPermissionAction>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseListPermissionAction.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseListPermissionAction> mapFromJson(dynamic json) {
    final map = <String, ApiResponseListPermissionAction>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseListPermissionAction.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ApiResponseListPermissionAction-objects as value to a dart map
  static Map<String, List<ApiResponseListPermissionAction>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ApiResponseListPermissionAction>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ApiResponseListPermissionAction.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ApiResponseListPermissionAction] instances from JSON data.
class ApiResponseListPermissionActionFactory extends JsonSchemaFactory<ApiResponseListPermissionAction> {
  const ApiResponseListPermissionActionFactory();

  @override
  ApiResponseListPermissionAction fromJson(dynamic json) => ApiResponseListPermissionAction.fromJson(json)!;
}


class ApiResponseListPermissionActionDataEnum {
  /// Instantiate a new enum with the provided [value].
  const ApiResponseListPermissionActionDataEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ADMIN_TENANT = ApiResponseListPermissionActionDataEnum._(r'ADMIN_TENANT');
  static const UPDATE_TENANT = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TENANT');
  static const READ_TENANT = ApiResponseListPermissionActionDataEnum._(r'READ_TENANT');
  static const CREATE_STOCK_RESOURCE = ApiResponseListPermissionActionDataEnum._(r'CREATE_STOCK_RESOURCE');
  static const CREATE_EMPLOYEE = ApiResponseListPermissionActionDataEnum._(r'CREATE_EMPLOYEE');
  static const CREATE_TICKET = ApiResponseListPermissionActionDataEnum._(r'CREATE_TICKET');
  static const CREATE_TEAM = ApiResponseListPermissionActionDataEnum._(r'CREATE_TEAM');
  static const CREATE_STOCK_MOVEMENT = ApiResponseListPermissionActionDataEnum._(r'CREATE_STOCK_MOVEMENT');
  static const CREATE_STOCK_COUNT = ApiResponseListPermissionActionDataEnum._(r'CREATE_STOCK_COUNT');
  static const CREATE_PRODUCT = ApiResponseListPermissionActionDataEnum._(r'CREATE_PRODUCT');
  static const CREATE_PRODUCT_RECIPE = ApiResponseListPermissionActionDataEnum._(r'CREATE_PRODUCT_RECIPE');
  static const CREATE_PRODUCT_EXTRA_OPTION = ApiResponseListPermissionActionDataEnum._(r'CREATE_PRODUCT_EXTRA_OPTION');
  static const CREATE_MENU = ApiResponseListPermissionActionDataEnum._(r'CREATE_MENU');
  static const CREATE_MENU_CATEGORY = ApiResponseListPermissionActionDataEnum._(r'CREATE_MENU_CATEGORY');
  static const CREATE_MENU_ITEM = ApiResponseListPermissionActionDataEnum._(r'CREATE_MENU_ITEM');
  static const READ_USER = ApiResponseListPermissionActionDataEnum._(r'READ_USER');
  static const READ_PERMISSION = ApiResponseListPermissionActionDataEnum._(r'READ_PERMISSION');
  static const ADMIN_STOCK_RESOURCE = ApiResponseListPermissionActionDataEnum._(r'ADMIN_STOCK_RESOURCE');
  static const UPDATE_STOCK_RESOURCE = ApiResponseListPermissionActionDataEnum._(r'UPDATE_STOCK_RESOURCE');
  static const DELETE_STOCK_RESOURCE = ApiResponseListPermissionActionDataEnum._(r'DELETE_STOCK_RESOURCE');
  static const READ_STOCK_RESOURCE = ApiResponseListPermissionActionDataEnum._(r'READ_STOCK_RESOURCE');
  static const READ_EMPLOYEE = ApiResponseListPermissionActionDataEnum._(r'READ_EMPLOYEE');
  static const UPDATE_EMPLOYEE = ApiResponseListPermissionActionDataEnum._(r'UPDATE_EMPLOYEE');
  static const DELETE_EMPLOYEE = ApiResponseListPermissionActionDataEnum._(r'DELETE_EMPLOYEE');
  static const READ_TEAM = ApiResponseListPermissionActionDataEnum._(r'READ_TEAM');
  static const UPDATE_TEAM = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TEAM');
  static const DELETE_TEAM = ApiResponseListPermissionActionDataEnum._(r'DELETE_TEAM');
  static const CREATE_TEAM_MEMBER = ApiResponseListPermissionActionDataEnum._(r'CREATE_TEAM_MEMBER');
  static const READ_TEAM_MEMBER = ApiResponseListPermissionActionDataEnum._(r'READ_TEAM_MEMBER');
  static const UPDATE_TEAM_MEMBER = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TEAM_MEMBER');
  static const DELETE_TEAM_MEMBER = ApiResponseListPermissionActionDataEnum._(r'DELETE_TEAM_MEMBER');
  static const READ_TICKET = ApiResponseListPermissionActionDataEnum._(r'READ_TICKET');
  static const UPDATE_TICKET = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TICKET');
  static const DELETE_TICKET = ApiResponseListPermissionActionDataEnum._(r'DELETE_TICKET');
  static const CREATE_TICKET_HISTORY = ApiResponseListPermissionActionDataEnum._(r'CREATE_TICKET_HISTORY');
  static const CREATE_TICKET_COMMENT = ApiResponseListPermissionActionDataEnum._(r'CREATE_TICKET_COMMENT');
  static const CREATE_TICKET_ASSIGNMENT = ApiResponseListPermissionActionDataEnum._(r'CREATE_TICKET_ASSIGNMENT');
  static const CREATE_TICKET_ATTACHMENT = ApiResponseListPermissionActionDataEnum._(r'CREATE_TICKET_ATTACHMENT');
  static const CREATE_TICKET_SLA_TRACKING = ApiResponseListPermissionActionDataEnum._(r'CREATE_TICKET_SLA_TRACKING');
  static const CREATE_TICKET_WATCHER = ApiResponseListPermissionActionDataEnum._(r'CREATE_TICKET_WATCHER');
  static const READ_TICKET_HISTORY = ApiResponseListPermissionActionDataEnum._(r'READ_TICKET_HISTORY');
  static const UPDATE_TICKET_HISTORY = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TICKET_HISTORY');
  static const DELETE_TICKET_HISTORY = ApiResponseListPermissionActionDataEnum._(r'DELETE_TICKET_HISTORY');
  static const READ_TICKET_COMMENT = ApiResponseListPermissionActionDataEnum._(r'READ_TICKET_COMMENT');
  static const UPDATE_TICKET_COMMENT = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TICKET_COMMENT');
  static const DELETE_TICKET_COMMENT = ApiResponseListPermissionActionDataEnum._(r'DELETE_TICKET_COMMENT');
  static const READ_TICKET_ASSIGNMENT = ApiResponseListPermissionActionDataEnum._(r'READ_TICKET_ASSIGNMENT');
  static const UPDATE_TICKET_ASSIGNMENT = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TICKET_ASSIGNMENT');
  static const DELETE_TICKET_ASSIGNMENT = ApiResponseListPermissionActionDataEnum._(r'DELETE_TICKET_ASSIGNMENT');
  static const READ_TICKET_ATTACHMENT = ApiResponseListPermissionActionDataEnum._(r'READ_TICKET_ATTACHMENT');
  static const UPDATE_TICKET_ATTACHMENT = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TICKET_ATTACHMENT');
  static const DELETE_TICKET_ATTACHMENT = ApiResponseListPermissionActionDataEnum._(r'DELETE_TICKET_ATTACHMENT');
  static const READ_TICKET_SLA_TRACKING = ApiResponseListPermissionActionDataEnum._(r'READ_TICKET_SLA_TRACKING');
  static const UPDATE_TICKET_SLA_TRACKING = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TICKET_SLA_TRACKING');
  static const DELETE_TICKET_SLA_TRACKING = ApiResponseListPermissionActionDataEnum._(r'DELETE_TICKET_SLA_TRACKING');
  static const READ_TICKET_WATCHER = ApiResponseListPermissionActionDataEnum._(r'READ_TICKET_WATCHER');
  static const UPDATE_TICKET_WATCHER = ApiResponseListPermissionActionDataEnum._(r'UPDATE_TICKET_WATCHER');
  static const DELETE_TICKET_WATCHER = ApiResponseListPermissionActionDataEnum._(r'DELETE_TICKET_WATCHER');
  static const READ_STOCK_MOVEMENT = ApiResponseListPermissionActionDataEnum._(r'READ_STOCK_MOVEMENT');
  static const ADMIN_STOCK_COUNT = ApiResponseListPermissionActionDataEnum._(r'ADMIN_STOCK_COUNT');
  static const UPDATE_STOCK_COUNT = ApiResponseListPermissionActionDataEnum._(r'UPDATE_STOCK_COUNT');
  static const DELETE_STOCK_COUNT = ApiResponseListPermissionActionDataEnum._(r'DELETE_STOCK_COUNT');
  static const READ_STOCK_COUNT = ApiResponseListPermissionActionDataEnum._(r'READ_STOCK_COUNT');
  static const ADMIN_PRODUCT = ApiResponseListPermissionActionDataEnum._(r'ADMIN_PRODUCT');
  static const UPDATE_PRODUCT = ApiResponseListPermissionActionDataEnum._(r'UPDATE_PRODUCT');
  static const DELETE_PRODUCT = ApiResponseListPermissionActionDataEnum._(r'DELETE_PRODUCT');
  static const READ_PRODUCT = ApiResponseListPermissionActionDataEnum._(r'READ_PRODUCT');
  static const ADMIN_PRODUCT_RECIPE = ApiResponseListPermissionActionDataEnum._(r'ADMIN_PRODUCT_RECIPE');
  static const UPDATE_PRODUCT_RECIPE = ApiResponseListPermissionActionDataEnum._(r'UPDATE_PRODUCT_RECIPE');
  static const DELETE_PRODUCT_RECIPE = ApiResponseListPermissionActionDataEnum._(r'DELETE_PRODUCT_RECIPE');
  static const READ_PRODUCT_RECIPE = ApiResponseListPermissionActionDataEnum._(r'READ_PRODUCT_RECIPE');
  static const ADMIN_PRODUCT_EXTRA_OPTION = ApiResponseListPermissionActionDataEnum._(r'ADMIN_PRODUCT_EXTRA_OPTION');
  static const UPDATE_PRODUCT_EXTRA_OPTION = ApiResponseListPermissionActionDataEnum._(r'UPDATE_PRODUCT_EXTRA_OPTION');
  static const DELETE_PRODUCT_EXTRA_OPTION = ApiResponseListPermissionActionDataEnum._(r'DELETE_PRODUCT_EXTRA_OPTION');
  static const READ_PRODUCT_EXTRA_OPTION = ApiResponseListPermissionActionDataEnum._(r'READ_PRODUCT_EXTRA_OPTION');
  static const ADMIN_MENU = ApiResponseListPermissionActionDataEnum._(r'ADMIN_MENU');
  static const UPDATE_MENU = ApiResponseListPermissionActionDataEnum._(r'UPDATE_MENU');
  static const DELETE_MENU = ApiResponseListPermissionActionDataEnum._(r'DELETE_MENU');
  static const READ_MENU = ApiResponseListPermissionActionDataEnum._(r'READ_MENU');
  static const ADMIN_MENU_CATEGORY = ApiResponseListPermissionActionDataEnum._(r'ADMIN_MENU_CATEGORY');
  static const UPDATE_MENU_CATEGORY = ApiResponseListPermissionActionDataEnum._(r'UPDATE_MENU_CATEGORY');
  static const DELETE_MENU_CATEGORY = ApiResponseListPermissionActionDataEnum._(r'DELETE_MENU_CATEGORY');
  static const READ_MENU_CATEGORY = ApiResponseListPermissionActionDataEnum._(r'READ_MENU_CATEGORY');
  static const ADMIN_MENU_ITEM = ApiResponseListPermissionActionDataEnum._(r'ADMIN_MENU_ITEM');
  static const UPDATE_MENU_ITEM = ApiResponseListPermissionActionDataEnum._(r'UPDATE_MENU_ITEM');
  static const DELETE_MENU_ITEM = ApiResponseListPermissionActionDataEnum._(r'DELETE_MENU_ITEM');
  static const READ_MENU_ITEM = ApiResponseListPermissionActionDataEnum._(r'READ_MENU_ITEM');

  /// List of all possible values in this [enum][ApiResponseListPermissionActionDataEnum].
  static const values = <ApiResponseListPermissionActionDataEnum>[
    ADMIN_TENANT,
    UPDATE_TENANT,
    READ_TENANT,
    CREATE_STOCK_RESOURCE,
    CREATE_EMPLOYEE,
    CREATE_TICKET,
    CREATE_TEAM,
    CREATE_STOCK_MOVEMENT,
    CREATE_STOCK_COUNT,
    CREATE_PRODUCT,
    CREATE_PRODUCT_RECIPE,
    CREATE_PRODUCT_EXTRA_OPTION,
    CREATE_MENU,
    CREATE_MENU_CATEGORY,
    CREATE_MENU_ITEM,
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
    READ_STOCK_MOVEMENT,
    ADMIN_STOCK_COUNT,
    UPDATE_STOCK_COUNT,
    DELETE_STOCK_COUNT,
    READ_STOCK_COUNT,
    ADMIN_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    READ_PRODUCT,
    ADMIN_PRODUCT_RECIPE,
    UPDATE_PRODUCT_RECIPE,
    DELETE_PRODUCT_RECIPE,
    READ_PRODUCT_RECIPE,
    ADMIN_PRODUCT_EXTRA_OPTION,
    UPDATE_PRODUCT_EXTRA_OPTION,
    DELETE_PRODUCT_EXTRA_OPTION,
    READ_PRODUCT_EXTRA_OPTION,
    ADMIN_MENU,
    UPDATE_MENU,
    DELETE_MENU,
    READ_MENU,
    ADMIN_MENU_CATEGORY,
    UPDATE_MENU_CATEGORY,
    DELETE_MENU_CATEGORY,
    READ_MENU_CATEGORY,
    ADMIN_MENU_ITEM,
    UPDATE_MENU_ITEM,
    DELETE_MENU_ITEM,
    READ_MENU_ITEM,
  ];

  static ApiResponseListPermissionActionDataEnum? fromJson(dynamic value) => ApiResponseListPermissionActionDataEnumTypeTransformer().decode(value);

  static List<ApiResponseListPermissionActionDataEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseListPermissionActionDataEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseListPermissionActionDataEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ApiResponseListPermissionActionDataEnum] to String,
/// and [decode] dynamic data back to [ApiResponseListPermissionActionDataEnum].
class ApiResponseListPermissionActionDataEnumTypeTransformer {
  factory ApiResponseListPermissionActionDataEnumTypeTransformer() => _instance ??= const ApiResponseListPermissionActionDataEnumTypeTransformer._();

  const ApiResponseListPermissionActionDataEnumTypeTransformer._();

  String encode(ApiResponseListPermissionActionDataEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ApiResponseListPermissionActionDataEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ApiResponseListPermissionActionDataEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ADMIN_TENANT': return ApiResponseListPermissionActionDataEnum.ADMIN_TENANT;
        case r'UPDATE_TENANT': return ApiResponseListPermissionActionDataEnum.UPDATE_TENANT;
        case r'READ_TENANT': return ApiResponseListPermissionActionDataEnum.READ_TENANT;
        case r'CREATE_STOCK_RESOURCE': return ApiResponseListPermissionActionDataEnum.CREATE_STOCK_RESOURCE;
        case r'CREATE_EMPLOYEE': return ApiResponseListPermissionActionDataEnum.CREATE_EMPLOYEE;
        case r'CREATE_TICKET': return ApiResponseListPermissionActionDataEnum.CREATE_TICKET;
        case r'CREATE_TEAM': return ApiResponseListPermissionActionDataEnum.CREATE_TEAM;
        case r'CREATE_STOCK_MOVEMENT': return ApiResponseListPermissionActionDataEnum.CREATE_STOCK_MOVEMENT;
        case r'CREATE_STOCK_COUNT': return ApiResponseListPermissionActionDataEnum.CREATE_STOCK_COUNT;
        case r'CREATE_PRODUCT': return ApiResponseListPermissionActionDataEnum.CREATE_PRODUCT;
        case r'CREATE_PRODUCT_RECIPE': return ApiResponseListPermissionActionDataEnum.CREATE_PRODUCT_RECIPE;
        case r'CREATE_PRODUCT_EXTRA_OPTION': return ApiResponseListPermissionActionDataEnum.CREATE_PRODUCT_EXTRA_OPTION;
        case r'CREATE_MENU': return ApiResponseListPermissionActionDataEnum.CREATE_MENU;
        case r'CREATE_MENU_CATEGORY': return ApiResponseListPermissionActionDataEnum.CREATE_MENU_CATEGORY;
        case r'CREATE_MENU_ITEM': return ApiResponseListPermissionActionDataEnum.CREATE_MENU_ITEM;
        case r'READ_USER': return ApiResponseListPermissionActionDataEnum.READ_USER;
        case r'READ_PERMISSION': return ApiResponseListPermissionActionDataEnum.READ_PERMISSION;
        case r'ADMIN_STOCK_RESOURCE': return ApiResponseListPermissionActionDataEnum.ADMIN_STOCK_RESOURCE;
        case r'UPDATE_STOCK_RESOURCE': return ApiResponseListPermissionActionDataEnum.UPDATE_STOCK_RESOURCE;
        case r'DELETE_STOCK_RESOURCE': return ApiResponseListPermissionActionDataEnum.DELETE_STOCK_RESOURCE;
        case r'READ_STOCK_RESOURCE': return ApiResponseListPermissionActionDataEnum.READ_STOCK_RESOURCE;
        case r'READ_EMPLOYEE': return ApiResponseListPermissionActionDataEnum.READ_EMPLOYEE;
        case r'UPDATE_EMPLOYEE': return ApiResponseListPermissionActionDataEnum.UPDATE_EMPLOYEE;
        case r'DELETE_EMPLOYEE': return ApiResponseListPermissionActionDataEnum.DELETE_EMPLOYEE;
        case r'READ_TEAM': return ApiResponseListPermissionActionDataEnum.READ_TEAM;
        case r'UPDATE_TEAM': return ApiResponseListPermissionActionDataEnum.UPDATE_TEAM;
        case r'DELETE_TEAM': return ApiResponseListPermissionActionDataEnum.DELETE_TEAM;
        case r'CREATE_TEAM_MEMBER': return ApiResponseListPermissionActionDataEnum.CREATE_TEAM_MEMBER;
        case r'READ_TEAM_MEMBER': return ApiResponseListPermissionActionDataEnum.READ_TEAM_MEMBER;
        case r'UPDATE_TEAM_MEMBER': return ApiResponseListPermissionActionDataEnum.UPDATE_TEAM_MEMBER;
        case r'DELETE_TEAM_MEMBER': return ApiResponseListPermissionActionDataEnum.DELETE_TEAM_MEMBER;
        case r'READ_TICKET': return ApiResponseListPermissionActionDataEnum.READ_TICKET;
        case r'UPDATE_TICKET': return ApiResponseListPermissionActionDataEnum.UPDATE_TICKET;
        case r'DELETE_TICKET': return ApiResponseListPermissionActionDataEnum.DELETE_TICKET;
        case r'CREATE_TICKET_HISTORY': return ApiResponseListPermissionActionDataEnum.CREATE_TICKET_HISTORY;
        case r'CREATE_TICKET_COMMENT': return ApiResponseListPermissionActionDataEnum.CREATE_TICKET_COMMENT;
        case r'CREATE_TICKET_ASSIGNMENT': return ApiResponseListPermissionActionDataEnum.CREATE_TICKET_ASSIGNMENT;
        case r'CREATE_TICKET_ATTACHMENT': return ApiResponseListPermissionActionDataEnum.CREATE_TICKET_ATTACHMENT;
        case r'CREATE_TICKET_SLA_TRACKING': return ApiResponseListPermissionActionDataEnum.CREATE_TICKET_SLA_TRACKING;
        case r'CREATE_TICKET_WATCHER': return ApiResponseListPermissionActionDataEnum.CREATE_TICKET_WATCHER;
        case r'READ_TICKET_HISTORY': return ApiResponseListPermissionActionDataEnum.READ_TICKET_HISTORY;
        case r'UPDATE_TICKET_HISTORY': return ApiResponseListPermissionActionDataEnum.UPDATE_TICKET_HISTORY;
        case r'DELETE_TICKET_HISTORY': return ApiResponseListPermissionActionDataEnum.DELETE_TICKET_HISTORY;
        case r'READ_TICKET_COMMENT': return ApiResponseListPermissionActionDataEnum.READ_TICKET_COMMENT;
        case r'UPDATE_TICKET_COMMENT': return ApiResponseListPermissionActionDataEnum.UPDATE_TICKET_COMMENT;
        case r'DELETE_TICKET_COMMENT': return ApiResponseListPermissionActionDataEnum.DELETE_TICKET_COMMENT;
        case r'READ_TICKET_ASSIGNMENT': return ApiResponseListPermissionActionDataEnum.READ_TICKET_ASSIGNMENT;
        case r'UPDATE_TICKET_ASSIGNMENT': return ApiResponseListPermissionActionDataEnum.UPDATE_TICKET_ASSIGNMENT;
        case r'DELETE_TICKET_ASSIGNMENT': return ApiResponseListPermissionActionDataEnum.DELETE_TICKET_ASSIGNMENT;
        case r'READ_TICKET_ATTACHMENT': return ApiResponseListPermissionActionDataEnum.READ_TICKET_ATTACHMENT;
        case r'UPDATE_TICKET_ATTACHMENT': return ApiResponseListPermissionActionDataEnum.UPDATE_TICKET_ATTACHMENT;
        case r'DELETE_TICKET_ATTACHMENT': return ApiResponseListPermissionActionDataEnum.DELETE_TICKET_ATTACHMENT;
        case r'READ_TICKET_SLA_TRACKING': return ApiResponseListPermissionActionDataEnum.READ_TICKET_SLA_TRACKING;
        case r'UPDATE_TICKET_SLA_TRACKING': return ApiResponseListPermissionActionDataEnum.UPDATE_TICKET_SLA_TRACKING;
        case r'DELETE_TICKET_SLA_TRACKING': return ApiResponseListPermissionActionDataEnum.DELETE_TICKET_SLA_TRACKING;
        case r'READ_TICKET_WATCHER': return ApiResponseListPermissionActionDataEnum.READ_TICKET_WATCHER;
        case r'UPDATE_TICKET_WATCHER': return ApiResponseListPermissionActionDataEnum.UPDATE_TICKET_WATCHER;
        case r'DELETE_TICKET_WATCHER': return ApiResponseListPermissionActionDataEnum.DELETE_TICKET_WATCHER;
        case r'READ_STOCK_MOVEMENT': return ApiResponseListPermissionActionDataEnum.READ_STOCK_MOVEMENT;
        case r'ADMIN_STOCK_COUNT': return ApiResponseListPermissionActionDataEnum.ADMIN_STOCK_COUNT;
        case r'UPDATE_STOCK_COUNT': return ApiResponseListPermissionActionDataEnum.UPDATE_STOCK_COUNT;
        case r'DELETE_STOCK_COUNT': return ApiResponseListPermissionActionDataEnum.DELETE_STOCK_COUNT;
        case r'READ_STOCK_COUNT': return ApiResponseListPermissionActionDataEnum.READ_STOCK_COUNT;
        case r'ADMIN_PRODUCT': return ApiResponseListPermissionActionDataEnum.ADMIN_PRODUCT;
        case r'UPDATE_PRODUCT': return ApiResponseListPermissionActionDataEnum.UPDATE_PRODUCT;
        case r'DELETE_PRODUCT': return ApiResponseListPermissionActionDataEnum.DELETE_PRODUCT;
        case r'READ_PRODUCT': return ApiResponseListPermissionActionDataEnum.READ_PRODUCT;
        case r'ADMIN_PRODUCT_RECIPE': return ApiResponseListPermissionActionDataEnum.ADMIN_PRODUCT_RECIPE;
        case r'UPDATE_PRODUCT_RECIPE': return ApiResponseListPermissionActionDataEnum.UPDATE_PRODUCT_RECIPE;
        case r'DELETE_PRODUCT_RECIPE': return ApiResponseListPermissionActionDataEnum.DELETE_PRODUCT_RECIPE;
        case r'READ_PRODUCT_RECIPE': return ApiResponseListPermissionActionDataEnum.READ_PRODUCT_RECIPE;
        case r'ADMIN_PRODUCT_EXTRA_OPTION': return ApiResponseListPermissionActionDataEnum.ADMIN_PRODUCT_EXTRA_OPTION;
        case r'UPDATE_PRODUCT_EXTRA_OPTION': return ApiResponseListPermissionActionDataEnum.UPDATE_PRODUCT_EXTRA_OPTION;
        case r'DELETE_PRODUCT_EXTRA_OPTION': return ApiResponseListPermissionActionDataEnum.DELETE_PRODUCT_EXTRA_OPTION;
        case r'READ_PRODUCT_EXTRA_OPTION': return ApiResponseListPermissionActionDataEnum.READ_PRODUCT_EXTRA_OPTION;
        case r'ADMIN_MENU': return ApiResponseListPermissionActionDataEnum.ADMIN_MENU;
        case r'UPDATE_MENU': return ApiResponseListPermissionActionDataEnum.UPDATE_MENU;
        case r'DELETE_MENU': return ApiResponseListPermissionActionDataEnum.DELETE_MENU;
        case r'READ_MENU': return ApiResponseListPermissionActionDataEnum.READ_MENU;
        case r'ADMIN_MENU_CATEGORY': return ApiResponseListPermissionActionDataEnum.ADMIN_MENU_CATEGORY;
        case r'UPDATE_MENU_CATEGORY': return ApiResponseListPermissionActionDataEnum.UPDATE_MENU_CATEGORY;
        case r'DELETE_MENU_CATEGORY': return ApiResponseListPermissionActionDataEnum.DELETE_MENU_CATEGORY;
        case r'READ_MENU_CATEGORY': return ApiResponseListPermissionActionDataEnum.READ_MENU_CATEGORY;
        case r'ADMIN_MENU_ITEM': return ApiResponseListPermissionActionDataEnum.ADMIN_MENU_ITEM;
        case r'UPDATE_MENU_ITEM': return ApiResponseListPermissionActionDataEnum.UPDATE_MENU_ITEM;
        case r'DELETE_MENU_ITEM': return ApiResponseListPermissionActionDataEnum.DELETE_MENU_ITEM;
        case r'READ_MENU_ITEM': return ApiResponseListPermissionActionDataEnum.READ_MENU_ITEM;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ApiResponseListPermissionActionDataEnumTypeTransformer] instance.
  static ApiResponseListPermissionActionDataEnumTypeTransformer? _instance;
}


