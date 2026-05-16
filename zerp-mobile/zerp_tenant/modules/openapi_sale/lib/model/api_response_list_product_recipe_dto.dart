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
import 'product_recipe_dto.dart';


part 'api_response_list_product_recipe_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseListProductRecipeDTO extends Schema {
  /// Returns a new [ApiResponseListProductRecipeDTO] instance.
  ApiResponseListProductRecipeDTO({
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
  final List<ProductRecipeDTO> data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseListProductRecipeDTO] from JSON.
  static const factory = ApiResponseListProductRecipeDTOFactory();

  factory ApiResponseListProductRecipeDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseListProductRecipeDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseListProductRecipeDTOToJson(this);

  static List<ApiResponseListProductRecipeDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseListProductRecipeDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseListProductRecipeDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseListProductRecipeDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseListProductRecipeDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseListProductRecipeDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseListProductRecipeDTOFactory extends JsonSchemaFactory<ApiResponseListProductRecipeDTO> {
  const ApiResponseListProductRecipeDTOFactory();

  @override
  ApiResponseListProductRecipeDTO fromJson(dynamic json) => ApiResponseListProductRecipeDTO.fromJson(json as Map<String, dynamic>);
}




