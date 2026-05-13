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
import 'page_employee_list_response_dto.dart';
import 'parameter.dart';


part 'api_response_page_employee_list_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponsePageEmployeeListResponseDto extends Schema {
  /// Returns a new [ApiResponsePageEmployeeListResponseDto] instance.
  ApiResponsePageEmployeeListResponseDto({
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
  final PageEmployeeListResponseDto? data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponsePageEmployeeListResponseDto] from JSON.
  static const factory = ApiResponsePageEmployeeListResponseDtoFactory();

  factory ApiResponsePageEmployeeListResponseDto.fromJson(Map<String, dynamic> json) => _$ApiResponsePageEmployeeListResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponsePageEmployeeListResponseDtoToJson(this);

  static List<ApiResponsePageEmployeeListResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponsePageEmployeeListResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponsePageEmployeeListResponseDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponsePageEmployeeListResponseDto> mapFromJson(dynamic json) {
    final map = <String, ApiResponsePageEmployeeListResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponsePageEmployeeListResponseDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponsePageEmployeeListResponseDtoFactory extends JsonSchemaFactory<ApiResponsePageEmployeeListResponseDto> {
  const ApiResponsePageEmployeeListResponseDtoFactory();

  @override
  ApiResponsePageEmployeeListResponseDto fromJson(dynamic json) => ApiResponsePageEmployeeListResponseDto.fromJson(json as Map<String, dynamic>);
}




