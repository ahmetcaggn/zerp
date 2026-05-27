//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_adjustment_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockAdjustmentItemDTO extends Schema {
  /// Returns a new [StockAdjustmentItemDTO] instance.
  StockAdjustmentItemDTO({
    this.stockResourceId,
    this.quantity,
    this.direction,
    this.reason,
    this.notes,
  });

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'direction')
  final StockAdjustmentItemDTODirectionEnum? direction;

  @JsonKey(name: r'reason')
  final String? reason;

  @JsonKey(name: r'notes')
  final String? notes;

  /// The factory instance for creating [StockAdjustmentItemDTO] from JSON.
  static const factory = StockAdjustmentItemDTOFactory();

  factory StockAdjustmentItemDTO.fromJson(Map<String, dynamic> json) => _$StockAdjustmentItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockAdjustmentItemDTOToJson(this);

  static List<StockAdjustmentItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockAdjustmentItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockAdjustmentItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockAdjustmentItemDTO> mapFromJson(dynamic json) {
    final map = <String, StockAdjustmentItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockAdjustmentItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockAdjustmentItemDTOFactory extends JsonSchemaFactory<StockAdjustmentItemDTO> {
  const StockAdjustmentItemDTOFactory();

  @override
  StockAdjustmentItemDTO fromJson(dynamic json) => StockAdjustmentItemDTO.fromJson(json as Map<String, dynamic>);
}



enum StockAdjustmentItemDTODirectionEnum {
@JsonValue('INCREASE')
INCREASE('INCREASE'),
@JsonValue('DECREASE')
DECREASE('DECREASE');

const StockAdjustmentItemDTODirectionEnum(this.value);

final String value;

@override
String toString() => value;
}




