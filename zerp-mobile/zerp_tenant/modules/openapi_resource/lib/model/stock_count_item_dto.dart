//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_count_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockCountItemDTO extends Schema {
  /// Returns a new [StockCountItemDTO] instance.
  StockCountItemDTO({
    this.id,
    this.stockResourceId,
    this.stockResourceName,
    this.unitTypeAbbreviation,
    this.theoreticalQuantity,
    this.previousQuantity,
    this.movementDelta,
    this.expectedQuantity,
    this.actualQuantity,
    this.discrepancy,
    this.notes,
    this.countedBy,
    this.countedAt,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'stockResourceName')
  final String? stockResourceName;

  @JsonKey(name: r'unitTypeAbbreviation')
  final String? unitTypeAbbreviation;

  @JsonKey(name: r'theoreticalQuantity')
  final num? theoreticalQuantity;

  @JsonKey(name: r'previousQuantity')
  final num? previousQuantity;

  @JsonKey(name: r'movementDelta')
  final num? movementDelta;

  @JsonKey(name: r'expectedQuantity')
  final num? expectedQuantity;

  @JsonKey(name: r'actualQuantity')
  final num? actualQuantity;

  @JsonKey(name: r'discrepancy')
  final num? discrepancy;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'countedBy')
  final String? countedBy;

  @JsonKey(name: r'countedAt')
  final DateTime? countedAt;

  /// The factory instance for creating [StockCountItemDTO] from JSON.
  static const factory = StockCountItemDTOFactory();

  factory StockCountItemDTO.fromJson(Map<String, dynamic> json) => _$StockCountItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockCountItemDTOToJson(this);

  static List<StockCountItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountItemDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockCountItemDTOFactory extends JsonSchemaFactory<StockCountItemDTO> {
  const StockCountItemDTOFactory();

  @override
  StockCountItemDTO fromJson(dynamic json) => StockCountItemDTO.fromJson(json as Map<String, dynamic>);
}




