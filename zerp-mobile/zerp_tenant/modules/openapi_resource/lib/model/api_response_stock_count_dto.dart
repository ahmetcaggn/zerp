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
import 'stock_count_dto.dart';


part 'api_response_stock_count_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApiResponseStockCountDTO extends Schema {
  /// Returns a new [ApiResponseStockCountDTO] instance.
  ApiResponseStockCountDTO({
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
  final StockCountDTO? data;

  @JsonKey(name: r'meta')
  final Meta? meta;

  @JsonKey(name: r'parameters')
  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseStockCountDTO] from JSON.
  static const factory = ApiResponseStockCountDTOFactory();

  factory ApiResponseStockCountDTO.fromJson(Map<String, dynamic> json) => _$ApiResponseStockCountDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ApiResponseStockCountDTOToJson(this);

  static List<ApiResponseStockCountDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseStockCountDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseStockCountDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseStockCountDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseStockCountDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseStockCountDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ApiResponseStockCountDTOFactory extends JsonSchemaFactory<ApiResponseStockCountDTO> {
  const ApiResponseStockCountDTOFactory();

  @override
  ApiResponseStockCountDTO fromJson(dynamic json) => ApiResponseStockCountDTO.fromJson(json as Map<String, dynamic>);
}




