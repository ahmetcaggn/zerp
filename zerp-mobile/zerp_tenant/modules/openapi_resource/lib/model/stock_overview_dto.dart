//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_overview_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockOverviewDTO extends Schema {
  /// Returns a new [StockOverviewDTO] instance.
  StockOverviewDTO({
    this.stockResourceId,
    this.stockResourceName,
    this.unitType,
    this.realQuantity,
    this.expectedQuantity,
    this.variance,
    this.reorderThreshold,
    this.lastCountId,
    this.lastCountedAt,
    this.lastCountedBy,
    this.lastCountQuantity,
    this.lastExpectedQuantity,
    this.saleDelta,
    this.wasteDelta,
    this.purchaseDelta,
    this.returnDelta,
    this.adjustmentDelta,
    this.transferDelta,
  });

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'stockResourceName')
  final String? stockResourceName;

  @JsonKey(name: r'unitType')
  final StockOverviewDTOUnitTypeEnum? unitType;

  @JsonKey(name: r'realQuantity')
  final num? realQuantity;

  @JsonKey(name: r'expectedQuantity')
  final num? expectedQuantity;

  @JsonKey(name: r'variance')
  final num? variance;

  @JsonKey(name: r'reorderThreshold')
  final num? reorderThreshold;

  @JsonKey(name: r'lastCountId')
  final String? lastCountId;

  @JsonKey(name: r'lastCountedAt')
  final DateTime? lastCountedAt;

  @JsonKey(name: r'lastCountedBy')
  final String? lastCountedBy;

  @JsonKey(name: r'lastCountQuantity')
  final num? lastCountQuantity;

  @JsonKey(name: r'lastExpectedQuantity')
  final num? lastExpectedQuantity;

  @JsonKey(name: r'saleDelta')
  final num? saleDelta;

  @JsonKey(name: r'wasteDelta')
  final num? wasteDelta;

  @JsonKey(name: r'purchaseDelta')
  final num? purchaseDelta;

  @JsonKey(name: r'returnDelta')
  final num? returnDelta;

  @JsonKey(name: r'adjustmentDelta')
  final num? adjustmentDelta;

  @JsonKey(name: r'transferDelta')
  final num? transferDelta;

  /// The factory instance for creating [StockOverviewDTO] from JSON.
  static const factory = StockOverviewDTOFactory();

  factory StockOverviewDTO.fromJson(Map<String, dynamic> json) => _$StockOverviewDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockOverviewDTOToJson(this);

  static List<StockOverviewDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockOverviewDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockOverviewDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockOverviewDTO> mapFromJson(dynamic json) {
    final map = <String, StockOverviewDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockOverviewDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockOverviewDTOFactory extends JsonSchemaFactory<StockOverviewDTO> {
  const StockOverviewDTOFactory();

  @override
  StockOverviewDTO fromJson(dynamic json) => StockOverviewDTO.fromJson(json as Map<String, dynamic>);
}



enum StockOverviewDTOUnitTypeEnum {
@JsonValue('PIECE')
PIECE('PIECE'),
@JsonValue('GRAM')
GRAM('GRAM'),
@JsonValue('KILOGRAM')
KILOGRAM('KILOGRAM'),
@JsonValue('MILLILITER')
MILLILITER('MILLILITER'),
@JsonValue('LITER')
LITER('LITER');

const StockOverviewDTOUnitTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




