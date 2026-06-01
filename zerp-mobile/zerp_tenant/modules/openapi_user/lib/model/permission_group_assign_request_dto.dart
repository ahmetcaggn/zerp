//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'permission_group_assign_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PermissionGroupAssignRequestDTO extends Schema {
  /// Returns a new [PermissionGroupAssignRequestDTO] instance.
  PermissionGroupAssignRequestDTO({
    this.userId,
    this.groupId,
    this.predefinedCode,
    this.scopeTargetId,
  });

  @JsonKey(name: r'userId')
  final String? userId;

  @JsonKey(name: r'groupId')
  final String? groupId;

  @JsonKey(name: r'predefinedCode')
  final PermissionGroupAssignRequestDTOPredefinedCodeEnum? predefinedCode;

  @JsonKey(name: r'scopeTargetId')
  final String? scopeTargetId;

  /// The factory instance for creating [PermissionGroupAssignRequestDTO] from JSON.
  static const factory = PermissionGroupAssignRequestDTOFactory();

  factory PermissionGroupAssignRequestDTO.fromJson(Map<String, dynamic> json) => _$PermissionGroupAssignRequestDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PermissionGroupAssignRequestDTOToJson(this);

  static List<PermissionGroupAssignRequestDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermissionGroupAssignRequestDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermissionGroupAssignRequestDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PermissionGroupAssignRequestDTO> mapFromJson(dynamic json) {
    final map = <String, PermissionGroupAssignRequestDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PermissionGroupAssignRequestDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PermissionGroupAssignRequestDTOFactory extends JsonSchemaFactory<PermissionGroupAssignRequestDTO> {
  const PermissionGroupAssignRequestDTOFactory();

  @override
  PermissionGroupAssignRequestDTO fromJson(dynamic json) => PermissionGroupAssignRequestDTO.fromJson(json as Map<String, dynamic>);
}



enum PermissionGroupAssignRequestDTOPredefinedCodeEnum {
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

const PermissionGroupAssignRequestDTOPredefinedCodeEnum(this.value);

final String value;

@override
String toString() => value;
}




