//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'menu_dto.dart';
import 'meta.dart';
import 'parameter.dart';


part 'api_response_list_menu_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseListMenuDTO extends Schema {
  /// Returns a new [ApiResponseListMenuDTO] instance.
  ApiResponseListMenuDTO({
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
  final List<MenuDTO> data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseListMenuDTO] from JSON.
  static const factory = ApiResponseListMenuDTOFactory();

  factory ApiResponseListMenuDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseListMenuDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseListMenuDTOToJson(this);

  static List<ApiResponseListMenuDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseListMenuDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseListMenuDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseListMenuDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseListMenuDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseListMenuDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseListMenuDTOFactory extends JsonSchemaFactory<ApiResponseListMenuDTO> {
  const ApiResponseListMenuDTOFactory();

  @override
  ApiResponseListMenuDTO fromJson(dynamic json) => ApiResponseListMenuDTO.fromJson(json as Map<String, dynamic>);
}




