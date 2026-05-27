//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_entry_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockEntryItemDTO extends Schema {
  /// Returns a new [StockEntryItemDTO] instance.
  StockEntryItemDTO({
    this.stockResourceId,
    this.quantity,
    this.referenceNo,
    this.notes,
  });

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'referenceNo')
  final String? referenceNo;

  @JsonKey(name: r'notes')
  final String? notes;

  /// The factory instance for creating [StockEntryItemDTO] from JSON.
  static const factory = StockEntryItemDTOFactory();

  factory StockEntryItemDTO.fromJson(Map<String, dynamic> json) => _$StockEntryItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockEntryItemDTOToJson(this);

  static List<StockEntryItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockEntryItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockEntryItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockEntryItemDTO> mapFromJson(dynamic json) {
    final map = <String, StockEntryItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockEntryItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockEntryItemDTOFactory extends JsonSchemaFactory<StockEntryItemDTO> {
  const StockEntryItemDTOFactory();

  @override
  StockEntryItemDTO fromJson(dynamic json) => StockEntryItemDTO.fromJson(json as Map<String, dynamic>);
}




