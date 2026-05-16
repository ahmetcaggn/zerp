//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_count_item_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockCountItemUpdateDTO extends Schema {
  /// Returns a new [StockCountItemUpdateDTO] instance.
  StockCountItemUpdateDTO({
    this.stockCountItemId,
    this.actualQuantity,
    this.wasteQuantity,
    this.notes,
  });

  @JsonKey(name: r'stockCountItemId')
  final String? stockCountItemId;

  @JsonKey(name: r'actualQuantity')
  final num? actualQuantity;

  @JsonKey(name: r'wasteQuantity')
  final num? wasteQuantity;

  @JsonKey(name: r'notes')
  final String? notes;

  /// The factory instance for creating [StockCountItemUpdateDTO] from JSON.
  static const factory = StockCountItemUpdateDTOFactory();

  factory StockCountItemUpdateDTO.fromJson(Map<String, dynamic> json) => _$StockCountItemUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockCountItemUpdateDTOToJson(this);

  static List<StockCountItemUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountItemUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountItemUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountItemUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountItemUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountItemUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockCountItemUpdateDTOFactory extends JsonSchemaFactory<StockCountItemUpdateDTO> {
  const StockCountItemUpdateDTOFactory();

  @override
  StockCountItemUpdateDTO fromJson(dynamic json) => StockCountItemUpdateDTO.fromJson(json as Map<String, dynamic>);
}




