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
import 'tenant_response_dto.dart';


part 'api_response_list_tenant_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseListTenantResponseDTO extends Schema {
  /// Returns a new [ApiResponseListTenantResponseDTO] instance.
  ApiResponseListTenantResponseDTO({
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
  final List<TenantResponseDTO> data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseListTenantResponseDTO] from JSON.
  static const factory = ApiResponseListTenantResponseDTOFactory();

  factory ApiResponseListTenantResponseDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseListTenantResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseListTenantResponseDTOToJson(this);

  static List<ApiResponseListTenantResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseListTenantResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseListTenantResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseListTenantResponseDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseListTenantResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseListTenantResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseListTenantResponseDTOFactory extends JsonSchemaFactory<ApiResponseListTenantResponseDTO> {
  const ApiResponseListTenantResponseDTOFactory();

  @override
  ApiResponseListTenantResponseDTO fromJson(dynamic json) => ApiResponseListTenantResponseDTO.fromJson(json as Map<String, dynamic>);
}




