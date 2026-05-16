//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'menu_item_dto.dart';
import 'meta.dart';
import 'parameter.dart';


part 'api_response_list_menu_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseListMenuItemDTO extends Schema {
  /// Returns a new [ApiResponseListMenuItemDTO] instance.
  ApiResponseListMenuItemDTO({
    this.success,
    this.statusCode,
    this.message,
    this.data = const [],
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
  final List<MenuItemDTO> data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseListMenuItemDTO] from JSON.
  static const factory = ApiResponseListMenuItemDTOFactory();

  factory ApiResponseListMenuItemDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseListMenuItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseListMenuItemDTOToJson(this);

  static List<ApiResponseListMenuItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseListMenuItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseListMenuItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseListMenuItemDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseListMenuItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseListMenuItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseListMenuItemDTOFactory extends JsonSchemaFactory<ApiResponseListMenuItemDTO> {
  const ApiResponseListMenuItemDTOFactory();

  @override
  ApiResponseListMenuItemDTO fromJson(dynamic json) => ApiResponseListMenuItemDTO.fromJson(json as Map<String, dynamic>);
}




