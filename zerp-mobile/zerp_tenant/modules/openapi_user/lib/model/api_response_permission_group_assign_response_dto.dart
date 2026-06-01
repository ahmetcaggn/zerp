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
import 'permission_group_assign_response_dto.dart';


part 'api_response_permission_group_assign_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponsePermissionGroupAssignResponseDTO extends Schema {
  /// Returns a new [ApiResponsePermissionGroupAssignResponseDTO] instance.
  ApiResponsePermissionGroupAssignResponseDTO({
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
  final PermissionGroupAssignResponseDTO? data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponsePermissionGroupAssignResponseDTO] from JSON.
  static const factory = ApiResponsePermissionGroupAssignResponseDTOFactory();

  factory ApiResponsePermissionGroupAssignResponseDTO.fromJson(Map<String, dynamic> json) => _$ApiResponsePermissionGroupAssignResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponsePermissionGroupAssignResponseDTOToJson(this);

  static List<ApiResponsePermissionGroupAssignResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponsePermissionGroupAssignResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponsePermissionGroupAssignResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponsePermissionGroupAssignResponseDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponsePermissionGroupAssignResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponsePermissionGroupAssignResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponsePermissionGroupAssignResponseDTOFactory extends JsonSchemaFactory<ApiResponsePermissionGroupAssignResponseDTO> {
  const ApiResponsePermissionGroupAssignResponseDTOFactory();

  @override
  ApiResponsePermissionGroupAssignResponseDTO fromJson(dynamic json) => ApiResponsePermissionGroupAssignResponseDTO.fromJson(json as Map<String, dynamic>);
}




