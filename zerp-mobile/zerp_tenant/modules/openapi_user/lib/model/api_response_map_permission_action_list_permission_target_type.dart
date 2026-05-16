//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'meta.dart';
import 'parameter.dart';


part 'api_response_map_permission_action_list_permission_target_type.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseMapPermissionActionListPermissionTargetType extends Schema {
  /// Returns a new [ApiResponseMapPermissionActionListPermissionTargetType] instance.
  ApiResponseMapPermissionActionListPermissionTargetType({
    this.success,
    this.statusCode,
    this.message,
    this.data = const {},
    this.meta,
    this.parameters = const [],
  });

  @JsonKey(name: r'success')
  final bool? success;

  @JsonKey(name: r'statusCode')
  final int? statusCode;

  @JsonKey(name: r'message')
  final String? message;

  @JsonKey(name: r'data')
  final Map<String, List<ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum>> data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseMapPermissionActionListPermissionTargetType] from JSON.
  static const factory = ApiResponseMapPermissionActionListPermissionTargetTypeFactory();

  factory ApiResponseMapPermissionActionListPermissionTargetType.fromJson(Map<String, dynamic> json) => _$ApiResponseMapPermissionActionListPermissionTargetTypeFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseMapPermissionActionListPermissionTargetTypeToJson(this);

  static List<ApiResponseMapPermissionActionListPermissionTargetType> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseMapPermissionActionListPermissionTargetType>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseMapPermissionActionListPermissionTargetType.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseMapPermissionActionListPermissionTargetType> mapFromJson(dynamic json) {
    final map = <String, ApiResponseMapPermissionActionListPermissionTargetType>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseMapPermissionActionListPermissionTargetType.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseMapPermissionActionListPermissionTargetTypeFactory extends JsonSchemaFactory<ApiResponseMapPermissionActionListPermissionTargetType> {
  const ApiResponseMapPermissionActionListPermissionTargetTypeFactory();

  @override
  ApiResponseMapPermissionActionListPermissionTargetType fromJson(dynamic json) => ApiResponseMapPermissionActionListPermissionTargetType.fromJson(json as Map<String, dynamic>);
}



enum ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum {
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

const ApiResponseMapPermissionActionListPermissionTargetTypeDataEnum(this.value);

final String value;

@override
String toString() => value;
}




