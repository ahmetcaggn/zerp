//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'permittable_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PermittableResponseDTO extends Schema {
  /// Returns a new [PermittableResponseDTO] instance.
  PermittableResponseDTO({
    this.id,
    this.title,
    this.targetType,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'title')
  final String? title;

  @JsonKey(name: r'targetType')
  final PermittableResponseDTOTargetTypeEnum? targetType;

  /// The factory instance for creating [PermittableResponseDTO] from JSON.
  static const factory = PermittableResponseDTOFactory();

  factory PermittableResponseDTO.fromJson(Map<String, dynamic> json) => _$PermittableResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PermittableResponseDTOToJson(this);

  static List<PermittableResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PermittableResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PermittableResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PermittableResponseDTO> mapFromJson(dynamic json) {
    final map = <String, PermittableResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PermittableResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PermittableResponseDTOFactory extends JsonSchemaFactory<PermittableResponseDTO> {
  const PermittableResponseDTOFactory();

  @override
  PermittableResponseDTO fromJson(dynamic json) => PermittableResponseDTO.fromJson(json as Map<String, dynamic>);
}



enum PermittableResponseDTOTargetTypeEnum {
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
@JsonValue('SHOP_TABLE')
SHOP_TABLE('SHOP_TABLE'),
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
MENU_ITEM('MENU_ITEM');

const PermittableResponseDTOTargetTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




