//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'permission_group_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PermissionGroupResponseDTO extends Schema {
  /// Returns a new [PermissionGroupResponseDTO] instance.
  PermissionGroupResponseDTO({
    this.source_,
    this.id,
    this.code,
    this.name,
    this.description,
    this.scopeType,
    this.actions = const [],
    this.createdAt,
    this.updatedAt,
  });

  @JsonKey(name: r'source')
  final String? source_;

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'code')
  final PermissionGroupResponseDTOCodeEnum? code;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'scopeType')
  final PermissionGroupResponseDTOScopeTypeEnum? scopeType;

  @JsonKey(name: r'actions')
  final List<PermissionGroupResponseDTOActionsEnum> actions;

  @JsonKey(name: r'createdAt')
  final DateTime? createdAt;

  @JsonKey(name: r'updatedAt')
  final DateTime? updatedAt;

  /// The factory instance for creating [PermissionGroupResponseDTO] from JSON.
  static const factory = PermissionGroupResponseDTOFactory();

  factory PermissionGroupResponseDTO.fromJson(Map<String, dynamic> json) => _$PermissionGroupResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PermissionGroupResponseDTOToJson(this);

  static List<PermissionGroupResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionGroupResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionGroupResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PermissionGroupResponseDTO> mapFromJson(dynamic json) {
    final map = <String, PermissionGroupResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PermissionGroupResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PermissionGroupResponseDTOFactory extends JsonSchemaFactory<PermissionGroupResponseDTO> {
  const PermissionGroupResponseDTOFactory();

  @override
  PermissionGroupResponseDTO fromJson(dynamic json) => PermissionGroupResponseDTO.fromJson(json as Map<String, dynamic>);
}



enum PermissionGroupResponseDTOCodeEnum {
@JsonValue('CASHIER')
CASHIER('CASHIER'),
@JsonValue('WAITER')
WAITER('WAITER'),
@JsonValue('STOCK_MANAGER')
STOCK_MANAGER('STOCK_MANAGER'),
@JsonValue('CATALOG_MANAGER')
CATALOG_MANAGER('CATALOG_MANAGER'),
@JsonValue('TENANT_SUPERVISOR')
TENANT_SUPERVISOR('TENANT_SUPERVISOR');

const PermissionGroupResponseDTOCodeEnum(this.value);

final String value;

@override
String toString() => value;
}



enum PermissionGroupResponseDTOScopeTypeEnum {
@JsonValue('TENANT')
TENANT('TENANT'),
@JsonValue('SHOP')
SHOP('SHOP');

const PermissionGroupResponseDTOScopeTypeEnum(this.value);

final String value;

@override
String toString() => value;
}



enum PermissionGroupResponseDTOActionsEnum {
@JsonValue('CREATE_EMPLOYEE_ANY_TENANT')
CREATE_EMPLOYEE_ANY_TENANT('CREATE_EMPLOYEE_ANY_TENANT'),
@JsonValue('ADMIN')
ADMIN('ADMIN'),
@JsonValue('UPDATE_TENANT')
UPDATE_TENANT('UPDATE_TENANT'),
@JsonValue('READ_TENANT')
READ_TENANT('READ_TENANT'),
@JsonValue('CREATE_EMPLOYEE')
CREATE_EMPLOYEE('CREATE_EMPLOYEE'),
@JsonValue('CREATE_TICKET')
CREATE_TICKET('CREATE_TICKET'),
@JsonValue('CREATE_TEAM')
CREATE_TEAM('CREATE_TEAM'),
@JsonValue('ADMIN_SHOP')
ADMIN_SHOP('ADMIN_SHOP'),
@JsonValue('UPDATE_SHOP')
UPDATE_SHOP('UPDATE_SHOP'),
@JsonValue('DELETE_SHOP')
DELETE_SHOP('DELETE_SHOP'),
@JsonValue('READ_SHOP')
READ_SHOP('READ_SHOP'),
@JsonValue('CREATE_STOCK_RESOURCE')
CREATE_STOCK_RESOURCE('CREATE_STOCK_RESOURCE'),
@JsonValue('CREATE_PRODUCT')
CREATE_PRODUCT('CREATE_PRODUCT'),
@JsonValue('CREATE_MENU')
CREATE_MENU('CREATE_MENU'),
@JsonValue('CREATE_SHOP_TABLE')
CREATE_SHOP_TABLE('CREATE_SHOP_TABLE'),
@JsonValue('CREATE_STOCK_COUNT')
CREATE_STOCK_COUNT('CREATE_STOCK_COUNT'),
@JsonValue('READ_SALE_HISTORY')
READ_SALE_HISTORY('READ_SALE_HISTORY'),
@JsonValue('READ_USER')
READ_USER('READ_USER'),
@JsonValue('READ_PERMISSION')
READ_PERMISSION('READ_PERMISSION'),
@JsonValue('ADMIN_STOCK_RESOURCE')
ADMIN_STOCK_RESOURCE('ADMIN_STOCK_RESOURCE'),
@JsonValue('UPDATE_STOCK_RESOURCE')
UPDATE_STOCK_RESOURCE('UPDATE_STOCK_RESOURCE'),
@JsonValue('DELETE_STOCK_RESOURCE')
DELETE_STOCK_RESOURCE('DELETE_STOCK_RESOURCE'),
@JsonValue('READ_STOCK_RESOURCE')
READ_STOCK_RESOURCE('READ_STOCK_RESOURCE'),
@JsonValue('CREATE_STOCK_MOVEMENT')
CREATE_STOCK_MOVEMENT('CREATE_STOCK_MOVEMENT'),
@JsonValue('CREATE_STOCK_ENTRY')
CREATE_STOCK_ENTRY('CREATE_STOCK_ENTRY'),
@JsonValue('CREATE_STOCK_ADJUSTMENT')
CREATE_STOCK_ADJUSTMENT('CREATE_STOCK_ADJUSTMENT'),
@JsonValue('CREATE_STOCK_WASTE')
CREATE_STOCK_WASTE('CREATE_STOCK_WASTE'),
@JsonValue('CREATE_STOCK_RETURN')
CREATE_STOCK_RETURN('CREATE_STOCK_RETURN'),
@JsonValue('READ_EMPLOYEE')
READ_EMPLOYEE('READ_EMPLOYEE'),
@JsonValue('UPDATE_EMPLOYEE')
UPDATE_EMPLOYEE('UPDATE_EMPLOYEE'),
@JsonValue('DELETE_EMPLOYEE')
DELETE_EMPLOYEE('DELETE_EMPLOYEE'),
@JsonValue('READ_TEAM')
READ_TEAM('READ_TEAM'),
@JsonValue('UPDATE_TEAM')
UPDATE_TEAM('UPDATE_TEAM'),
@JsonValue('DELETE_TEAM')
DELETE_TEAM('DELETE_TEAM'),
@JsonValue('CREATE_TEAM_MEMBER')
CREATE_TEAM_MEMBER('CREATE_TEAM_MEMBER'),
@JsonValue('READ_TEAM_MEMBER')
READ_TEAM_MEMBER('READ_TEAM_MEMBER'),
@JsonValue('UPDATE_TEAM_MEMBER')
UPDATE_TEAM_MEMBER('UPDATE_TEAM_MEMBER'),
@JsonValue('DELETE_TEAM_MEMBER')
DELETE_TEAM_MEMBER('DELETE_TEAM_MEMBER'),
@JsonValue('READ_TICKET')
READ_TICKET('READ_TICKET'),
@JsonValue('UPDATE_TICKET')
UPDATE_TICKET('UPDATE_TICKET'),
@JsonValue('DELETE_TICKET')
DELETE_TICKET('DELETE_TICKET'),
@JsonValue('CREATE_TICKET_COMMENT')
CREATE_TICKET_COMMENT('CREATE_TICKET_COMMENT'),
@JsonValue('CREATE_TICKET_ASSIGNMENT')
CREATE_TICKET_ASSIGNMENT('CREATE_TICKET_ASSIGNMENT'),
@JsonValue('CREATE_TICKET_ATTACHMENT')
CREATE_TICKET_ATTACHMENT('CREATE_TICKET_ATTACHMENT'),
@JsonValue('CREATE_TICKET_WATCHER')
CREATE_TICKET_WATCHER('CREATE_TICKET_WATCHER'),
@JsonValue('READ_TICKET_HISTORY')
READ_TICKET_HISTORY('READ_TICKET_HISTORY'),
@JsonValue('READ_TICKET_COMMENT')
READ_TICKET_COMMENT('READ_TICKET_COMMENT'),
@JsonValue('UPDATE_TICKET_COMMENT')
UPDATE_TICKET_COMMENT('UPDATE_TICKET_COMMENT'),
@JsonValue('DELETE_TICKET_COMMENT')
DELETE_TICKET_COMMENT('DELETE_TICKET_COMMENT'),
@JsonValue('READ_TICKET_ASSIGNMENT')
READ_TICKET_ASSIGNMENT('READ_TICKET_ASSIGNMENT'),
@JsonValue('UPDATE_TICKET_ASSIGNMENT')
UPDATE_TICKET_ASSIGNMENT('UPDATE_TICKET_ASSIGNMENT'),
@JsonValue('DELETE_TICKET_ASSIGNMENT')
DELETE_TICKET_ASSIGNMENT('DELETE_TICKET_ASSIGNMENT'),
@JsonValue('READ_TICKET_ATTACHMENT')
READ_TICKET_ATTACHMENT('READ_TICKET_ATTACHMENT'),
@JsonValue('UPDATE_TICKET_ATTACHMENT')
UPDATE_TICKET_ATTACHMENT('UPDATE_TICKET_ATTACHMENT'),
@JsonValue('DELETE_TICKET_ATTACHMENT')
DELETE_TICKET_ATTACHMENT('DELETE_TICKET_ATTACHMENT'),
@JsonValue('READ_TICKET_SLA_TRACKING')
READ_TICKET_SLA_TRACKING('READ_TICKET_SLA_TRACKING'),
@JsonValue('READ_TICKET_WATCHER')
READ_TICKET_WATCHER('READ_TICKET_WATCHER'),
@JsonValue('UPDATE_TICKET_WATCHER')
UPDATE_TICKET_WATCHER('UPDATE_TICKET_WATCHER'),
@JsonValue('DELETE_TICKET_WATCHER')
DELETE_TICKET_WATCHER('DELETE_TICKET_WATCHER'),
@JsonValue('READ_STOCK_MOVEMENT')
READ_STOCK_MOVEMENT('READ_STOCK_MOVEMENT'),
@JsonValue('UPDATE_STOCK_MOVEMENT')
UPDATE_STOCK_MOVEMENT('UPDATE_STOCK_MOVEMENT'),
@JsonValue('DELETE_STOCK_MOVEMENT')
DELETE_STOCK_MOVEMENT('DELETE_STOCK_MOVEMENT'),
@JsonValue('ADMIN_STOCK_COUNT')
ADMIN_STOCK_COUNT('ADMIN_STOCK_COUNT'),
@JsonValue('APPROVE_STOCK_COUNT')
APPROVE_STOCK_COUNT('APPROVE_STOCK_COUNT'),
@JsonValue('UPDATE_STOCK_COUNT')
UPDATE_STOCK_COUNT('UPDATE_STOCK_COUNT'),
@JsonValue('DELETE_STOCK_COUNT')
DELETE_STOCK_COUNT('DELETE_STOCK_COUNT'),
@JsonValue('READ_STOCK_COUNT')
READ_STOCK_COUNT('READ_STOCK_COUNT'),
@JsonValue('ADMIN_PRODUCT')
ADMIN_PRODUCT('ADMIN_PRODUCT'),
@JsonValue('UPDATE_PRODUCT')
UPDATE_PRODUCT('UPDATE_PRODUCT'),
@JsonValue('DELETE_PRODUCT')
DELETE_PRODUCT('DELETE_PRODUCT'),
@JsonValue('READ_PRODUCT')
READ_PRODUCT('READ_PRODUCT'),
@JsonValue('CREATE_PRODUCT_RECIPE')
CREATE_PRODUCT_RECIPE('CREATE_PRODUCT_RECIPE'),
@JsonValue('CREATE_PRODUCT_EXTRA_OPTION')
CREATE_PRODUCT_EXTRA_OPTION('CREATE_PRODUCT_EXTRA_OPTION'),
@JsonValue('ADMIN_PRODUCT_RECIPE')
ADMIN_PRODUCT_RECIPE('ADMIN_PRODUCT_RECIPE'),
@JsonValue('UPDATE_PRODUCT_RECIPE')
UPDATE_PRODUCT_RECIPE('UPDATE_PRODUCT_RECIPE'),
@JsonValue('DELETE_PRODUCT_RECIPE')
DELETE_PRODUCT_RECIPE('DELETE_PRODUCT_RECIPE'),
@JsonValue('READ_PRODUCT_RECIPE')
READ_PRODUCT_RECIPE('READ_PRODUCT_RECIPE'),
@JsonValue('ADMIN_PRODUCT_EXTRA_OPTION')
ADMIN_PRODUCT_EXTRA_OPTION('ADMIN_PRODUCT_EXTRA_OPTION'),
@JsonValue('UPDATE_PRODUCT_EXTRA_OPTION')
UPDATE_PRODUCT_EXTRA_OPTION('UPDATE_PRODUCT_EXTRA_OPTION'),
@JsonValue('DELETE_PRODUCT_EXTRA_OPTION')
DELETE_PRODUCT_EXTRA_OPTION('DELETE_PRODUCT_EXTRA_OPTION'),
@JsonValue('READ_PRODUCT_EXTRA_OPTION')
READ_PRODUCT_EXTRA_OPTION('READ_PRODUCT_EXTRA_OPTION'),
@JsonValue('ADMIN_MENU')
ADMIN_MENU('ADMIN_MENU'),
@JsonValue('UPDATE_MENU')
UPDATE_MENU('UPDATE_MENU'),
@JsonValue('DELETE_MENU')
DELETE_MENU('DELETE_MENU'),
@JsonValue('READ_MENU')
READ_MENU('READ_MENU'),
@JsonValue('CREATE_MENU_CATEGORY')
CREATE_MENU_CATEGORY('CREATE_MENU_CATEGORY'),
@JsonValue('ADMIN_MENU_CATEGORY')
ADMIN_MENU_CATEGORY('ADMIN_MENU_CATEGORY'),
@JsonValue('UPDATE_MENU_CATEGORY')
UPDATE_MENU_CATEGORY('UPDATE_MENU_CATEGORY'),
@JsonValue('DELETE_MENU_CATEGORY')
DELETE_MENU_CATEGORY('DELETE_MENU_CATEGORY'),
@JsonValue('READ_MENU_CATEGORY')
READ_MENU_CATEGORY('READ_MENU_CATEGORY'),
@JsonValue('CREATE_MENU_ITEM')
CREATE_MENU_ITEM('CREATE_MENU_ITEM'),
@JsonValue('ADMIN_MENU_ITEM')
ADMIN_MENU_ITEM('ADMIN_MENU_ITEM'),
@JsonValue('UPDATE_MENU_ITEM')
UPDATE_MENU_ITEM('UPDATE_MENU_ITEM'),
@JsonValue('DELETE_MENU_ITEM')
DELETE_MENU_ITEM('DELETE_MENU_ITEM'),
@JsonValue('READ_MENU_ITEM')
READ_MENU_ITEM('READ_MENU_ITEM'),
@JsonValue('ADMIN_SHOP_TABLE')
ADMIN_SHOP_TABLE('ADMIN_SHOP_TABLE'),
@JsonValue('UPDATE_SHOP_TABLE')
UPDATE_SHOP_TABLE('UPDATE_SHOP_TABLE'),
@JsonValue('DELETE_SHOP_TABLE')
DELETE_SHOP_TABLE('DELETE_SHOP_TABLE'),
@JsonValue('READ_SHOP_TABLE')
READ_SHOP_TABLE('READ_SHOP_TABLE'),
@JsonValue('CREATE_TABLE_ORDER')
CREATE_TABLE_ORDER('CREATE_TABLE_ORDER'),
@JsonValue('ADMIN_TABLE_ORDER')
ADMIN_TABLE_ORDER('ADMIN_TABLE_ORDER'),
@JsonValue('UPDATE_TABLE_ORDER')
UPDATE_TABLE_ORDER('UPDATE_TABLE_ORDER'),
@JsonValue('DELETE_TABLE_ORDER')
DELETE_TABLE_ORDER('DELETE_TABLE_ORDER'),
@JsonValue('READ_TABLE_ORDER')
READ_TABLE_ORDER('READ_TABLE_ORDER');

const PermissionGroupResponseDTOActionsEnum(this.value);

final String value;

@override
String toString() => value;
}




