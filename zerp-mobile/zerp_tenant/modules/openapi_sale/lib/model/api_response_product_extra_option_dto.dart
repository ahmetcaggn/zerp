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
import 'product_extra_option_dto.dart';


part 'api_response_product_extra_option_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseProductExtraOptionDTO extends Schema {
  /// Returns a new [ApiResponseProductExtraOptionDTO] instance.
  ApiResponseProductExtraOptionDTO({
    this.success,
    this.statusCode,
    this.message,
    this.data,
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
  final ProductExtraOptionDTO? data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseProductExtraOptionDTO] from JSON.
  static const factory = ApiResponseProductExtraOptionDTOFactory();

  factory ApiResponseProductExtraOptionDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseProductExtraOptionDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseProductExtraOptionDTOToJson(this);

  static List<ApiResponseProductExtraOptionDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseProductExtraOptionDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseProductExtraOptionDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseProductExtraOptionDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseProductExtraOptionDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseProductExtraOptionDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseProductExtraOptionDTOFactory extends JsonSchemaFactory<ApiResponseProductExtraOptionDTO> {
  const ApiResponseProductExtraOptionDTOFactory();

  @override
  ApiResponseProductExtraOptionDTO fromJson(dynamic json) => ApiResponseProductExtraOptionDTO.fromJson(json as Map<String, dynamic>);
}




