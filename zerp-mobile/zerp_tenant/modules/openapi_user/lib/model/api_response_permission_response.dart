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
import 'permission_response.dart';


part 'api_response_permission_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponsePermissionResponse extends Schema {
  /// Returns a new [ApiResponsePermissionResponse] instance.
  ApiResponsePermissionResponse({
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
  final PermissionResponse? data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponsePermissionResponse] from JSON.
  static const factory = ApiResponsePermissionResponseFactory();

  factory ApiResponsePermissionResponse.fromJson(Map<String, dynamic> json) => _$ApiResponsePermissionResponseFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponsePermissionResponseToJson(this);

  static List<ApiResponsePermissionResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponsePermissionResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponsePermissionResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponsePermissionResponse> mapFromJson(dynamic json) {
    final map = <String, ApiResponsePermissionResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponsePermissionResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponsePermissionResponseFactory extends JsonSchemaFactory<ApiResponsePermissionResponse> {
  const ApiResponsePermissionResponseFactory();

  @override
  ApiResponsePermissionResponse fromJson(dynamic json) => ApiResponsePermissionResponse.fromJson(json as Map<String, dynamic>);
}




