//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'menu_category_dto.dart';
import 'meta.dart';
import 'parameter.dart';


part 'api_response_list_menu_category_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseListMenuCategoryDTO extends Schema {
  /// Returns a new [ApiResponseListMenuCategoryDTO] instance.
  ApiResponseListMenuCategoryDTO({
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
  final List<MenuCategoryDTO> data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseListMenuCategoryDTO] from JSON.
  static const factory = ApiResponseListMenuCategoryDTOFactory();

  factory ApiResponseListMenuCategoryDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseListMenuCategoryDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseListMenuCategoryDTOToJson(this);

  static List<ApiResponseListMenuCategoryDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseListMenuCategoryDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseListMenuCategoryDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseListMenuCategoryDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseListMenuCategoryDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseListMenuCategoryDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseListMenuCategoryDTOFactory extends JsonSchemaFactory<ApiResponseListMenuCategoryDTO> {
  const ApiResponseListMenuCategoryDTOFactory();

  @override
  ApiResponseListMenuCategoryDTO fromJson(dynamic json) => ApiResponseListMenuCategoryDTO.fromJson(json as Map<String, dynamic>);
}




