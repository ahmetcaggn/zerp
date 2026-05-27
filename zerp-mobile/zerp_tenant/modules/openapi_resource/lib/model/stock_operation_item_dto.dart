//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_operation_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockOperationItemDTO extends Schema {
  /// Returns a new [StockOperationItemDTO] instance.
  StockOperationItemDTO({
    this.id,
    this.stockResourceId,
    this.stockResourceName,
    this.unitType,
    this.quantity,
    this.direction,
    this.unitCost,
    this.reason,
    this.referenceNo,
    this.notes,
    this.stockMovementId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'stockResourceName')
  final String? stockResourceName;

  @JsonKey(name: r'unitType')
  final StockOperationItemDTOUnitTypeEnum? unitType;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'direction')
  final StockOperationItemDTODirectionEnum? direction;

  @JsonKey(name: r'unitCost')
  final num? unitCost;

  @JsonKey(name: r'reason')
  final String? reason;

  @JsonKey(name: r'referenceNo')
  final String? referenceNo;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'stockMovementId')
  final String? stockMovementId;

  /// The factory instance for creating [StockOperationItemDTO] from JSON.
  static const factory = StockOperationItemDTOFactory();

  factory StockOperationItemDTO.fromJson(Map<String, dynamic> json) => _$StockOperationItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockOperationItemDTOToJson(this);

  static List<StockOperationItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockOperationItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockOperationItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockOperationItemDTO> mapFromJson(dynamic json) {
    final map = <String, StockOperationItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockOperationItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockOperationItemDTOFactory extends JsonSchemaFactory<StockOperationItemDTO> {
  const StockOperationItemDTOFactory();

  @override
  StockOperationItemDTO fromJson(dynamic json) => StockOperationItemDTO.fromJson(json as Map<String, dynamic>);
}



enum StockOperationItemDTOUnitTypeEnum {
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

const StockOperationItemDTOUnitTypeEnum(this.value);

final String value;

@override
String toString() => value;
}



enum StockOperationItemDTODirectionEnum {
@JsonValue('INCREASE')
INCREASE('INCREASE'),
@JsonValue('DECREASE')
DECREASE('DECREASE');

const StockOperationItemDTODirectionEnum(this.value);

final String value;

@override
String toString() => value;
}




