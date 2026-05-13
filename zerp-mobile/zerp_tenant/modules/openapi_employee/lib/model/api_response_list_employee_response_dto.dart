//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'employee_response_dto.dart';
import 'meta.dart';
import 'parameter.dart';


part 'api_response_list_employee_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseListEmployeeResponseDto extends Schema {
  /// Returns a new [ApiResponseListEmployeeResponseDto] instance.
  ApiResponseListEmployeeResponseDto({
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
  final List<EmployeeResponseDto> data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseListEmployeeResponseDto] from JSON.
  static const factory = ApiResponseListEmployeeResponseDtoFactory();

  factory ApiResponseListEmployeeResponseDto.fromJson(Map<String, dynamic> json) => _$ApiResponseListEmployeeResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseListEmployeeResponseDtoToJson(this);

  static List<ApiResponseListEmployeeResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseListEmployeeResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseListEmployeeResponseDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseListEmployeeResponseDto> mapFromJson(dynamic json) {
    final map = <String, ApiResponseListEmployeeResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseListEmployeeResponseDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseListEmployeeResponseDtoFactory extends JsonSchemaFactory<ApiResponseListEmployeeResponseDto> {
  const ApiResponseListEmployeeResponseDtoFactory();

  @override
  ApiResponseListEmployeeResponseDto fromJson(dynamic json) => ApiResponseListEmployeeResponseDto.fromJson(json as Map<String, dynamic>);
}




