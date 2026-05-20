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
import 'tenant_name_check_response_dto.dart';


part 'api_response_tenant_name_check_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseTenantNameCheckResponseDTO extends Schema {
  /// Returns a new [ApiResponseTenantNameCheckResponseDTO] instance.
  ApiResponseTenantNameCheckResponseDTO({
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
  final TenantNameCheckResponseDTO? data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseTenantNameCheckResponseDTO] from JSON.
  static const factory = ApiResponseTenantNameCheckResponseDTOFactory();

  factory ApiResponseTenantNameCheckResponseDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseTenantNameCheckResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseTenantNameCheckResponseDTOToJson(this);

  static List<ApiResponseTenantNameCheckResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseTenantNameCheckResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseTenantNameCheckResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseTenantNameCheckResponseDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseTenantNameCheckResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseTenantNameCheckResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseTenantNameCheckResponseDTOFactory extends JsonSchemaFactory<ApiResponseTenantNameCheckResponseDTO> {
  const ApiResponseTenantNameCheckResponseDTOFactory();

  @override
  ApiResponseTenantNameCheckResponseDTO fromJson(dynamic json) => ApiResponseTenantNameCheckResponseDTO.fromJson(json as Map<String, dynamic>);
}




