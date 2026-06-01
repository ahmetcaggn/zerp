//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'permission_group_assignment_revoke_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PermissionGroupAssignmentRevokeResponseDTO extends Schema {
  /// Returns a new [PermissionGroupAssignmentRevokeResponseDTO] instance.
  PermissionGroupAssignmentRevokeResponseDTO({
    this.assignmentId,
    this.groupId,
    this.userId,
    this.targetType,
    this.targetId,
    this.requestedCount,
    this.removedLinkCount,
    this.deletedPermissionCount,
    this.retainedPermissionCount,
    this.missingPermissionCount,
    this.warnings = const [],
  });

  @JsonKey(name: r'assignmentId')
  final String? assignmentId;

  @JsonKey(name: r'groupId')
  final String? groupId;

  @JsonKey(name: r'userId')
  final String? userId;

  @JsonKey(name: r'targetType')
  final PermissionGroupAssignmentRevokeResponseDTOTargetTypeEnum? targetType;

  @JsonKey(name: r'targetId')
  final String? targetId;

  @JsonKey(name: r'requestedCount')
  final int? requestedCount;

  @JsonKey(name: r'removedLinkCount')
  final int? removedLinkCount;

  @JsonKey(name: r'deletedPermissionCount')
  final int? deletedPermissionCount;

  @JsonKey(name: r'retainedPermissionCount')
  final int? retainedPermissionCount;

  @JsonKey(name: r'missingPermissionCount')
  final int? missingPermissionCount;

  @JsonKey(name: r'warnings')
  final List<String> warnings;

  /// The factory instance for creating [PermissionGroupAssignmentRevokeResponseDTO] from JSON.
  static const factory = PermissionGroupAssignmentRevokeResponseDTOFactory();

  factory PermissionGroupAssignmentRevokeResponseDTO.fromJson(Map<String, dynamic> json) => _$PermissionGroupAssignmentRevokeResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PermissionGroupAssignmentRevokeResponseDTOToJson(this);

  static List<PermissionGroupAssignmentRevokeResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionGroupAssignmentRevokeResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionGroupAssignmentRevokeResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PermissionGroupAssignmentRevokeResponseDTO> mapFromJson(dynamic json) {
    final map = <String, PermissionGroupAssignmentRevokeResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PermissionGroupAssignmentRevokeResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PermissionGroupAssignmentRevokeResponseDTOFactory extends JsonSchemaFactory<PermissionGroupAssignmentRevokeResponseDTO> {
  const PermissionGroupAssignmentRevokeResponseDTOFactory();

  @override
  PermissionGroupAssignmentRevokeResponseDTO fromJson(dynamic json) => PermissionGroupAssignmentRevokeResponseDTO.fromJson(json as Map<String, dynamic>);
}



enum PermissionGroupAssignmentRevokeResponseDTOTargetTypeEnum {
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

const PermissionGroupAssignmentRevokeResponseDTOTargetTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




