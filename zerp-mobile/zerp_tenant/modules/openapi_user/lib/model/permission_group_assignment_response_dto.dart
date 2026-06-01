//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'permission_group_assignment_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PermissionGroupAssignmentResponseDTO extends Schema {
  /// Returns a new [PermissionGroupAssignmentResponseDTO] instance.
  PermissionGroupAssignmentResponseDTO({
    this.id,
    this.groupId,
    this.groupName,
    this.groupSource,
    this.groupCode,
    this.groupScopeType,
    this.userId,
    this.targetType,
    this.targetId,
    this.assignedAt,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'groupId')
  final String? groupId;

  @JsonKey(name: r'groupName')
  final String? groupName;

  @JsonKey(name: r'groupSource')
  final String? groupSource;

  @JsonKey(name: r'groupCode')
  final PermissionGroupAssignmentResponseDTOGroupCodeEnum? groupCode;

  @JsonKey(name: r'groupScopeType')
  final PermissionGroupAssignmentResponseDTOGroupScopeTypeEnum? groupScopeType;

  @JsonKey(name: r'userId')
  final String? userId;

  @JsonKey(name: r'targetType')
  final PermissionGroupAssignmentResponseDTOTargetTypeEnum? targetType;

  @JsonKey(name: r'targetId')
  final String? targetId;

  @JsonKey(name: r'assignedAt')
  final DateTime? assignedAt;

  /// The factory instance for creating [PermissionGroupAssignmentResponseDTO] from JSON.
  static const factory = PermissionGroupAssignmentResponseDTOFactory();

  factory PermissionGroupAssignmentResponseDTO.fromJson(Map<String, dynamic> json) => _$PermissionGroupAssignmentResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PermissionGroupAssignmentResponseDTOToJson(this);

  static List<PermissionGroupAssignmentResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionGroupAssignmentResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionGroupAssignmentResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PermissionGroupAssignmentResponseDTO> mapFromJson(dynamic json) {
    final map = <String, PermissionGroupAssignmentResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PermissionGroupAssignmentResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PermissionGroupAssignmentResponseDTOFactory extends JsonSchemaFactory<PermissionGroupAssignmentResponseDTO> {
  const PermissionGroupAssignmentResponseDTOFactory();

  @override
  PermissionGroupAssignmentResponseDTO fromJson(dynamic json) => PermissionGroupAssignmentResponseDTO.fromJson(json as Map<String, dynamic>);
}



enum PermissionGroupAssignmentResponseDTOGroupCodeEnum {
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

const PermissionGroupAssignmentResponseDTOGroupCodeEnum(this.value);

final String value;

@override
String toString() => value;
}



enum PermissionGroupAssignmentResponseDTOGroupScopeTypeEnum {
@JsonValue('TENANT')
TENANT('TENANT'),
@JsonValue('SHOP')
SHOP('SHOP');

const PermissionGroupAssignmentResponseDTOGroupScopeTypeEnum(this.value);

final String value;

@override
String toString() => value;
}



enum PermissionGroupAssignmentResponseDTOTargetTypeEnum {
@JsonValue('TENANT_ROOT')
TENANT_ROOT('TENANT_ROOT'),
@JsonValue('TENANT')
TENANT('TENANT'),
@JsonValue('USER')
USER('USER'),
@JsonValue('EMPLOYEE')
EMPLOYEE('EMPLOYEE'),
@JsonValue('TICKET')
TICKET('TICKET'),
@JsonValue('TICKET_HISTORY')
TICKET_HISTORY('TICKET_HISTORY'),
@JsonValue('TICKET_COMMENT')
TICKET_COMMENT('TICKET_COMMENT'),
@JsonValue('TICKET_ASSIGNMENT')
TICKET_ASSIGNMENT('TICKET_ASSIGNMENT'),
@JsonValue('TICKET_ATTACHMENT')
TICKET_ATTACHMENT('TICKET_ATTACHMENT'),
@JsonValue('TICKET_SLA_TRACKING')
TICKET_SLA_TRACKING('TICKET_SLA_TRACKING'),
@JsonValue('TICKET_WATCHER')
TICKET_WATCHER('TICKET_WATCHER'),
@JsonValue('TEAM')
TEAM('TEAM'),
@JsonValue('TEAM_MEMBER')
TEAM_MEMBER('TEAM_MEMBER'),
@JsonValue('SHOP')
SHOP('SHOP'),
@JsonValue('STOCK_COUNT')
STOCK_COUNT('STOCK_COUNT'),
@JsonValue('STOCK_RESOURCE')
STOCK_RESOURCE('STOCK_RESOURCE'),
@JsonValue('STOCK_MOVEMENT')
STOCK_MOVEMENT('STOCK_MOVEMENT'),
@JsonValue('PRODUCT')
PRODUCT('PRODUCT'),
@JsonValue('PRODUCT_RECIPE')
PRODUCT_RECIPE('PRODUCT_RECIPE'),
@JsonValue('PRODUCT_EXTRA_OPTION')
PRODUCT_EXTRA_OPTION('PRODUCT_EXTRA_OPTION'),
@JsonValue('MENU')
MENU('MENU'),
@JsonValue('MENU_CATEGORY')
MENU_CATEGORY('MENU_CATEGORY'),
@JsonValue('MENU_ITEM')
MENU_ITEM('MENU_ITEM'),
@JsonValue('SHOP_TABLE')
SHOP_TABLE('SHOP_TABLE'),
@JsonValue('TABLE_ORDER')
TABLE_ORDER('TABLE_ORDER');

const PermissionGroupAssignmentResponseDTOTargetTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




