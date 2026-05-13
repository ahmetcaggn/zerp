//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'permission_update_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PermissionUpdateRequest extends Schema {
  /// Returns a new [PermissionUpdateRequest] instance.
  PermissionUpdateRequest({
    this.userId,
    this.targetType,
    this.targetId,
    this.action,
  });

  @JsonKey(name: r'userId')
  final String? userId;

  @JsonKey(name: r'targetType')
  final PermissionUpdateRequestTargetTypeEnum? targetType;

  @JsonKey(name: r'targetId')
  final String? targetId;

  @JsonKey(name: r'action')
  final PermissionUpdateRequestActionEnum? action;

  /// The factory instance for creating [PermissionUpdateRequest] from JSON.
  static const factory = PermissionUpdateRequestFactory();

  factory PermissionUpdateRequest.fromJson(Map<String, dynamic> json) => _$PermissionUpdateRequestFromJson(json);

  Map<String, dynamic> toJson() => _$PermissionUpdateRequestToJson(this);

  static List<PermissionUpdateRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionUpdateRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionUpdateRequest.fromJson(row as Map<String, dynamic>);
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
        final value = PermissionUpdateRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PermissionUpdateRequestFactory extends JsonSchemaFactory<PermissionUpdateRequest> {
  const PermissionUpdateRequestFactory();

  @override
  PermissionUpdateRequest fromJson(dynamic json) => PermissionUpdateRequest.fromJson(json as Map<String, dynamic>);
}



enum PermissionUpdateRequestTargetTypeEnum {
@JsonValue(r'TENANT_ROOT')
TENANT_ROOT(r'TENANT_ROOT'),
@JsonValue(r'TENANT')
TENANT(r'TENANT'),
@JsonValue(r'USER')
USER(r'USER'),
@JsonValue(r'STOCK_RESOURCE')
STOCK_RESOURCE(r'STOCK_RESOURCE'),
@JsonValue(r'EMPLOYEE')
EMPLOYEE(r'EMPLOYEE'),
@JsonValue(r'TICKET')
TICKET(r'TICKET'),
@JsonValue(r'TICKET_HISTORY')
TICKET_HISTORY(r'TICKET_HISTORY'),
@JsonValue(r'TICKET_COMMENT')
TICKET_COMMENT(r'TICKET_COMMENT'),
@JsonValue(r'TICKET_ASSIGNMENT')
TICKET_ASSIGNMENT(r'TICKET_ASSIGNMENT'),
@JsonValue(r'TICKET_ATTACHMENT')
TICKET_ATTACHMENT(r'TICKET_ATTACHMENT'),
@JsonValue(r'TICKET_SLA_TRACKING')
TICKET_SLA_TRACKING(r'TICKET_SLA_TRACKING'),
@JsonValue(r'TICKET_WATCHER')
TICKET_WATCHER(r'TICKET_WATCHER'),
@JsonValue(r'TEAM')
TEAM(r'TEAM'),
@JsonValue(r'TEAM_MEMBER')
TEAM_MEMBER(r'TEAM_MEMBER'),
@JsonValue(r'SHOP')
SHOP(r'SHOP'),
@JsonValue(r'SHOP_TABLE')
SHOP_TABLE(r'SHOP_TABLE'),
@JsonValue(r'STOCK_MOVEMENT')
STOCK_MOVEMENT(r'STOCK_MOVEMENT'),
@JsonValue(r'STOCK_COUNT')
STOCK_COUNT(r'STOCK_COUNT'),
@JsonValue(r'PRODUCT')
PRODUCT(r'PRODUCT'),
@JsonValue(r'PRODUCT_RECIPE')
PRODUCT_RECIPE(r'PRODUCT_RECIPE'),
@JsonValue(r'PRODUCT_EXTRA_OPTION')
PRODUCT_EXTRA_OPTION(r'PRODUCT_EXTRA_OPTION'),
@JsonValue(r'MENU')
MENU(r'MENU'),
@JsonValue(r'MENU_CATEGORY')
MENU_CATEGORY(r'MENU_CATEGORY'),
@JsonValue(r'MENU_ITEM')
MENU_ITEM(r'MENU_ITEM');

const PermissionUpdateRequestTargetTypeEnum(this.value);

final String value;

@override
String toString() => value;
}



enum PermissionUpdateRequestActionEnum {
@JsonValue(r'ADMIN_TENANT')
ADMIN_TENANT(r'ADMIN_TENANT'),
@JsonValue(r'UPDATE_TENANT')
UPDATE_TENANT(r'UPDATE_TENANT'),
@JsonValue(r'READ_TENANT')
READ_TENANT(r'READ_TENANT'),
@JsonValue(r'CREATE_STOCK_RESOURCE')
CREATE_STOCK_RESOURCE(r'CREATE_STOCK_RESOURCE'),
@JsonValue(r'CREATE_EMPLOYEE')
CREATE_EMPLOYEE(r'CREATE_EMPLOYEE'),
@JsonValue(r'CREATE_TICKET')
CREATE_TICKET(r'CREATE_TICKET'),
@JsonValue(r'CREATE_TEAM')
CREATE_TEAM(r'CREATE_TEAM'),
@JsonValue(r'CREATE_STOCK_MOVEMENT')
CREATE_STOCK_MOVEMENT(r'CREATE_STOCK_MOVEMENT'),
@JsonValue(r'CREATE_STOCK_COUNT')
CREATE_STOCK_COUNT(r'CREATE_STOCK_COUNT'),
@JsonValue(r'CREATE_PRODUCT')
CREATE_PRODUCT(r'CREATE_PRODUCT'),
@JsonValue(r'CREATE_PRODUCT_RECIPE')
CREATE_PRODUCT_RECIPE(r'CREATE_PRODUCT_RECIPE'),
@JsonValue(r'CREATE_PRODUCT_EXTRA_OPTION')
CREATE_PRODUCT_EXTRA_OPTION(r'CREATE_PRODUCT_EXTRA_OPTION'),
@JsonValue(r'CREATE_MENU')
CREATE_MENU(r'CREATE_MENU'),
@JsonValue(r'CREATE_MENU_CATEGORY')
CREATE_MENU_CATEGORY(r'CREATE_MENU_CATEGORY'),
@JsonValue(r'CREATE_MENU_ITEM')
CREATE_MENU_ITEM(r'CREATE_MENU_ITEM'),
@JsonValue(r'READ_USER')
READ_USER(r'READ_USER'),
@JsonValue(r'READ_PERMISSION')
READ_PERMISSION(r'READ_PERMISSION'),
@JsonValue(r'ADMIN_STOCK_RESOURCE')
ADMIN_STOCK_RESOURCE(r'ADMIN_STOCK_RESOURCE'),
@JsonValue(r'UPDATE_STOCK_RESOURCE')
UPDATE_STOCK_RESOURCE(r'UPDATE_STOCK_RESOURCE'),
@JsonValue(r'DELETE_STOCK_RESOURCE')
DELETE_STOCK_RESOURCE(r'DELETE_STOCK_RESOURCE'),
@JsonValue(r'READ_STOCK_RESOURCE')
READ_STOCK_RESOURCE(r'READ_STOCK_RESOURCE'),
@JsonValue(r'READ_EMPLOYEE')
READ_EMPLOYEE(r'READ_EMPLOYEE'),
@JsonValue(r'UPDATE_EMPLOYEE')
UPDATE_EMPLOYEE(r'UPDATE_EMPLOYEE'),
@JsonValue(r'DELETE_EMPLOYEE')
DELETE_EMPLOYEE(r'DELETE_EMPLOYEE'),
@JsonValue(r'READ_TEAM')
READ_TEAM(r'READ_TEAM'),
@JsonValue(r'UPDATE_TEAM')
UPDATE_TEAM(r'UPDATE_TEAM'),
@JsonValue(r'DELETE_TEAM')
DELETE_TEAM(r'DELETE_TEAM'),
@JsonValue(r'CREATE_TEAM_MEMBER')
CREATE_TEAM_MEMBER(r'CREATE_TEAM_MEMBER'),
@JsonValue(r'READ_TEAM_MEMBER')
READ_TEAM_MEMBER(r'READ_TEAM_MEMBER'),
@JsonValue(r'UPDATE_TEAM_MEMBER')
UPDATE_TEAM_MEMBER(r'UPDATE_TEAM_MEMBER'),
@JsonValue(r'DELETE_TEAM_MEMBER')
DELETE_TEAM_MEMBER(r'DELETE_TEAM_MEMBER'),
@JsonValue(r'READ_TICKET')
READ_TICKET(r'READ_TICKET'),
@JsonValue(r'UPDATE_TICKET')
UPDATE_TICKET(r'UPDATE_TICKET'),
@JsonValue(r'DELETE_TICKET')
DELETE_TICKET(r'DELETE_TICKET'),
@JsonValue(r'CREATE_TICKET_HISTORY')
CREATE_TICKET_HISTORY(r'CREATE_TICKET_HISTORY'),
@JsonValue(r'CREATE_TICKET_COMMENT')
CREATE_TICKET_COMMENT(r'CREATE_TICKET_COMMENT'),
@JsonValue(r'CREATE_TICKET_ASSIGNMENT')
CREATE_TICKET_ASSIGNMENT(r'CREATE_TICKET_ASSIGNMENT'),
@JsonValue(r'CREATE_TICKET_ATTACHMENT')
CREATE_TICKET_ATTACHMENT(r'CREATE_TICKET_ATTACHMENT'),
@JsonValue(r'CREATE_TICKET_SLA_TRACKING')
CREATE_TICKET_SLA_TRACKING(r'CREATE_TICKET_SLA_TRACKING'),
@JsonValue(r'CREATE_TICKET_WATCHER')
CREATE_TICKET_WATCHER(r'CREATE_TICKET_WATCHER'),
@JsonValue(r'READ_TICKET_HISTORY')
READ_TICKET_HISTORY(r'READ_TICKET_HISTORY'),
@JsonValue(r'UPDATE_TICKET_HISTORY')
UPDATE_TICKET_HISTORY(r'UPDATE_TICKET_HISTORY'),
@JsonValue(r'DELETE_TICKET_HISTORY')
DELETE_TICKET_HISTORY(r'DELETE_TICKET_HISTORY'),
@JsonValue(r'READ_TICKET_COMMENT')
READ_TICKET_COMMENT(r'READ_TICKET_COMMENT'),
@JsonValue(r'UPDATE_TICKET_COMMENT')
UPDATE_TICKET_COMMENT(r'UPDATE_TICKET_COMMENT'),
@JsonValue(r'DELETE_TICKET_COMMENT')
DELETE_TICKET_COMMENT(r'DELETE_TICKET_COMMENT'),
@JsonValue(r'READ_TICKET_ASSIGNMENT')
READ_TICKET_ASSIGNMENT(r'READ_TICKET_ASSIGNMENT'),
@JsonValue(r'UPDATE_TICKET_ASSIGNMENT')
UPDATE_TICKET_ASSIGNMENT(r'UPDATE_TICKET_ASSIGNMENT'),
@JsonValue(r'DELETE_TICKET_ASSIGNMENT')
DELETE_TICKET_ASSIGNMENT(r'DELETE_TICKET_ASSIGNMENT'),
@JsonValue(r'READ_TICKET_ATTACHMENT')
READ_TICKET_ATTACHMENT(r'READ_TICKET_ATTACHMENT'),
@JsonValue(r'UPDATE_TICKET_ATTACHMENT')
UPDATE_TICKET_ATTACHMENT(r'UPDATE_TICKET_ATTACHMENT'),
@JsonValue(r'DELETE_TICKET_ATTACHMENT')
DELETE_TICKET_ATTACHMENT(r'DELETE_TICKET_ATTACHMENT'),
@JsonValue(r'READ_TICKET_SLA_TRACKING')
READ_TICKET_SLA_TRACKING(r'READ_TICKET_SLA_TRACKING'),
@JsonValue(r'UPDATE_TICKET_SLA_TRACKING')
UPDATE_TICKET_SLA_TRACKING(r'UPDATE_TICKET_SLA_TRACKING'),
@JsonValue(r'DELETE_TICKET_SLA_TRACKING')
DELETE_TICKET_SLA_TRACKING(r'DELETE_TICKET_SLA_TRACKING'),
@JsonValue(r'READ_TICKET_WATCHER')
READ_TICKET_WATCHER(r'READ_TICKET_WATCHER'),
@JsonValue(r'UPDATE_TICKET_WATCHER')
UPDATE_TICKET_WATCHER(r'UPDATE_TICKET_WATCHER'),
@JsonValue(r'DELETE_TICKET_WATCHER')
DELETE_TICKET_WATCHER(r'DELETE_TICKET_WATCHER'),
@JsonValue(r'READ_STOCK_MOVEMENT')
READ_STOCK_MOVEMENT(r'READ_STOCK_MOVEMENT'),
@JsonValue(r'ADMIN_STOCK_COUNT')
ADMIN_STOCK_COUNT(r'ADMIN_STOCK_COUNT'),
@JsonValue(r'UPDATE_STOCK_COUNT')
UPDATE_STOCK_COUNT(r'UPDATE_STOCK_COUNT'),
@JsonValue(r'DELETE_STOCK_COUNT')
DELETE_STOCK_COUNT(r'DELETE_STOCK_COUNT'),
@JsonValue(r'READ_STOCK_COUNT')
READ_STOCK_COUNT(r'READ_STOCK_COUNT'),
@JsonValue(r'ADMIN_PRODUCT')
ADMIN_PRODUCT(r'ADMIN_PRODUCT'),
@JsonValue(r'UPDATE_PRODUCT')
UPDATE_PRODUCT(r'UPDATE_PRODUCT'),
@JsonValue(r'DELETE_PRODUCT')
DELETE_PRODUCT(r'DELETE_PRODUCT'),
@JsonValue(r'READ_PRODUCT')
READ_PRODUCT(r'READ_PRODUCT'),
@JsonValue(r'ADMIN_PRODUCT_RECIPE')
ADMIN_PRODUCT_RECIPE(r'ADMIN_PRODUCT_RECIPE'),
@JsonValue(r'UPDATE_PRODUCT_RECIPE')
UPDATE_PRODUCT_RECIPE(r'UPDATE_PRODUCT_RECIPE'),
@JsonValue(r'DELETE_PRODUCT_RECIPE')
DELETE_PRODUCT_RECIPE(r'DELETE_PRODUCT_RECIPE'),
@JsonValue(r'READ_PRODUCT_RECIPE')
READ_PRODUCT_RECIPE(r'READ_PRODUCT_RECIPE'),
@JsonValue(r'ADMIN_PRODUCT_EXTRA_OPTION')
ADMIN_PRODUCT_EXTRA_OPTION(r'ADMIN_PRODUCT_EXTRA_OPTION'),
@JsonValue(r'UPDATE_PRODUCT_EXTRA_OPTION')
UPDATE_PRODUCT_EXTRA_OPTION(r'UPDATE_PRODUCT_EXTRA_OPTION'),
@JsonValue(r'DELETE_PRODUCT_EXTRA_OPTION')
DELETE_PRODUCT_EXTRA_OPTION(r'DELETE_PRODUCT_EXTRA_OPTION'),
@JsonValue(r'READ_PRODUCT_EXTRA_OPTION')
READ_PRODUCT_EXTRA_OPTION(r'READ_PRODUCT_EXTRA_OPTION'),
@JsonValue(r'ADMIN_MENU')
ADMIN_MENU(r'ADMIN_MENU'),
@JsonValue(r'UPDATE_MENU')
UPDATE_MENU(r'UPDATE_MENU'),
@JsonValue(r'DELETE_MENU')
DELETE_MENU(r'DELETE_MENU'),
@JsonValue(r'READ_MENU')
READ_MENU(r'READ_MENU'),
@JsonValue(r'ADMIN_MENU_CATEGORY')
ADMIN_MENU_CATEGORY(r'ADMIN_MENU_CATEGORY'),
@JsonValue(r'UPDATE_MENU_CATEGORY')
UPDATE_MENU_CATEGORY(r'UPDATE_MENU_CATEGORY'),
@JsonValue(r'DELETE_MENU_CATEGORY')
DELETE_MENU_CATEGORY(r'DELETE_MENU_CATEGORY'),
@JsonValue(r'READ_MENU_CATEGORY')
READ_MENU_CATEGORY(r'READ_MENU_CATEGORY'),
@JsonValue(r'ADMIN_MENU_ITEM')
ADMIN_MENU_ITEM(r'ADMIN_MENU_ITEM'),
@JsonValue(r'UPDATE_MENU_ITEM')
UPDATE_MENU_ITEM(r'UPDATE_MENU_ITEM'),
@JsonValue(r'DELETE_MENU_ITEM')
DELETE_MENU_ITEM(r'DELETE_MENU_ITEM'),
@JsonValue(r'READ_MENU_ITEM')
READ_MENU_ITEM(r'READ_MENU_ITEM');

const PermissionUpdateRequestActionEnum(this.value);

final String value;

@override
String toString() => value;
}




