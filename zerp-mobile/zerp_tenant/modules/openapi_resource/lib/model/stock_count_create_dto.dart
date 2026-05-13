//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_count_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockCountCreateDTO extends Schema {
  /// Returns a new [StockCountCreateDTO] instance.
  StockCountCreateDTO({
    this.shopId,
    this.countDate,
    this.notes,
  });

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'countDate')
  final DateTime? countDate;

  @JsonKey(name: r'notes')
  final String? notes;

  /// The factory instance for creating [StockCountCreateDTO] from JSON.
  static const factory = StockCountCreateDTOFactory();

  factory StockCountCreateDTO.fromJson(Map<String, dynamic> json) => _$StockCountCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockCountCreateDTOToJson(this);

  static List<StockCountCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountCreateDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockCountCreateDTOFactory extends JsonSchemaFactory<StockCountCreateDTO> {
  const StockCountCreateDTOFactory();

  @override
  StockCountCreateDTO fromJson(dynamic json) => StockCountCreateDTO.fromJson(json as Map<String, dynamic>);
}




