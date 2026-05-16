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
import 'table_order_dto.dart';


part 'api_response_table_order_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseTableOrderDTO extends Schema {
  /// Returns a new [ApiResponseTableOrderDTO] instance.
  ApiResponseTableOrderDTO({
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
  final TableOrderDTO? data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseTableOrderDTO] from JSON.
  static const factory = ApiResponseTableOrderDTOFactory();

  factory ApiResponseTableOrderDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseTableOrderDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseTableOrderDTOToJson(this);

  static List<ApiResponseTableOrderDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseTableOrderDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseTableOrderDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseTableOrderDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseTableOrderDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseTableOrderDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseTableOrderDTOFactory extends JsonSchemaFactory<ApiResponseTableOrderDTO> {
  const ApiResponseTableOrderDTOFactory();

  @override
  ApiResponseTableOrderDTO fromJson(dynamic json) => ApiResponseTableOrderDTO.fromJson(json as Map<String, dynamic>);
}




