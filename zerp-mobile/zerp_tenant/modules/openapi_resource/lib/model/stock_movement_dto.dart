//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_movement_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockMovementDTO extends Schema {
  /// Returns a new [StockMovementDTO] instance.
  StockMovementDTO({
    this.id,
    this.stockResourceId,
    this.stockResourceName,
    this.type,
    this.direction,
    this.quantity,
    this.previousQuantity,
    this.newQuantity,
    this.referenceType,
    this.referenceId,
    this.notes,
    this.createdAt,
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'stockResourceName')
  final String? stockResourceName;

  @JsonKey(name: r'type')
  final StockMovementDTOTypeEnum? type;

  @JsonKey(name: r'direction')
  final StockMovementDTODirectionEnum? direction;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'previousQuantity')
  final num? previousQuantity;

  @JsonKey(name: r'newQuantity')
  final num? newQuantity;

  @JsonKey(name: r'referenceType')
  final String? referenceType;

  @JsonKey(name: r'referenceId')
  final String? referenceId;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'createdAt')
  final DateTime? createdAt;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [StockMovementDTO] from JSON.
  static const factory = StockMovementDTOFactory();

  factory StockMovementDTO.fromJson(Map<String, dynamic> json) => _$StockMovementDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockMovementDTOToJson(this);

  static List<StockMovementDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockMovementDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockMovementDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockMovementDTO> mapFromJson(dynamic json) {
    final map = <String, StockMovementDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockMovementDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockMovementDTOFactory extends JsonSchemaFactory<StockMovementDTO> {
  const StockMovementDTOFactory();

  @override
  StockMovementDTO fromJson(dynamic json) => StockMovementDTO.fromJson(json as Map<String, dynamic>);
}



enum StockMovementDTOTypeEnum {
@JsonValue('PURCHASE')
PURCHASE('PURCHASE'),
@JsonValue('SALE')
SALE('SALE'),
@JsonValue('WASTE')
WASTE('WASTE'),
@JsonValue('ADJUSTMENT')
ADJUSTMENT('ADJUSTMENT'),
@JsonValue('TRANSFER')
TRANSFER('TRANSFER'),
@JsonValue('RETURN')
RETURN('RETURN'),
@JsonValue('STOCK_COUNT_CORRECTION')
STOCK_COUNT_CORRECTION('STOCK_COUNT_CORRECTION');

const StockMovementDTOTypeEnum(this.value);

final String value;

@override
String toString() => value;
}



enum StockMovementDTODirectionEnum {
@JsonValue('IN')
IN('IN'),
@JsonValue('OUT')
OUT('OUT');

const StockMovementDTODirectionEnum(this.value);

final String value;

@override
String toString() => value;
}




