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
import 'stock_movement_dto.dart';


part 'api_response_stock_movement_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseStockMovementDTO extends Schema {
  /// Returns a new [ApiResponseStockMovementDTO] instance.
  ApiResponseStockMovementDTO({
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
  final StockMovementDTO? data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseStockMovementDTO] from JSON.
  static const factory = ApiResponseStockMovementDTOFactory();

  factory ApiResponseStockMovementDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseStockMovementDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseStockMovementDTOToJson(this);

  static List<ApiResponseStockMovementDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseStockMovementDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseStockMovementDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseStockMovementDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseStockMovementDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseStockMovementDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseStockMovementDTOFactory extends JsonSchemaFactory<ApiResponseStockMovementDTO> {
  const ApiResponseStockMovementDTOFactory();

  @override
  ApiResponseStockMovementDTO fromJson(dynamic json) => ApiResponseStockMovementDTO.fromJson(json as Map<String, dynamic>);
}




