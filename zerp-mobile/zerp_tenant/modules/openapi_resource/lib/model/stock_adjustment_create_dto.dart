//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'stock_adjustment_item_dto.dart';


part 'stock_adjustment_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockAdjustmentCreateDTO extends Schema {
  /// Returns a new [StockAdjustmentCreateDTO] instance.
  StockAdjustmentCreateDTO({
    this.shopId,
    this.referenceNo,
    this.notes,
    this.items = const [],
  });

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'referenceNo')
  final String? referenceNo;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'items')
  final List<StockAdjustmentItemDTO> items;

  /// The factory instance for creating [StockAdjustmentCreateDTO] from JSON.
  static const factory = StockAdjustmentCreateDTOFactory();

  factory StockAdjustmentCreateDTO.fromJson(Map<String, dynamic> json) => _$StockAdjustmentCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockAdjustmentCreateDTOToJson(this);

  static List<StockAdjustmentCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockAdjustmentCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockAdjustmentCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockAdjustmentCreateDTO> mapFromJson(dynamic json) {
    final map = <String, StockAdjustmentCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockAdjustmentCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockAdjustmentCreateDTOFactory extends JsonSchemaFactory<StockAdjustmentCreateDTO> {
  const StockAdjustmentCreateDTOFactory();

  @override
  StockAdjustmentCreateDTO fromJson(dynamic json) => StockAdjustmentCreateDTO.fromJson(json as Map<String, dynamic>);
}




