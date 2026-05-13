//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_movement_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockMovementCreateDTO extends Schema {
  /// Returns a new [StockMovementCreateDTO] instance.
  StockMovementCreateDTO({
    this.stockResourceId,
    this.type,
    this.quantity,
    this.referenceType,
    this.referenceId,
    this.notes,
  });

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'type')
  final StockMovementCreateDTOTypeEnum? type;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'referenceType')
  final String? referenceType;

  @JsonKey(name: r'referenceId')
  final String? referenceId;

  @JsonKey(name: r'notes')
  final String? notes;

  /// The factory instance for creating [StockMovementCreateDTO] from JSON.
  static const factory = StockMovementCreateDTOFactory();

  factory StockMovementCreateDTO.fromJson(Map<String, dynamic> json) => _$StockMovementCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockMovementCreateDTOToJson(this);

  static List<StockMovementCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockMovementCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockMovementCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockMovementCreateDTO> mapFromJson(dynamic json) {
    final map = <String, StockMovementCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockMovementCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockMovementCreateDTOFactory extends JsonSchemaFactory<StockMovementCreateDTO> {
  const StockMovementCreateDTOFactory();

  @override
  StockMovementCreateDTO fromJson(dynamic json) => StockMovementCreateDTO.fromJson(json as Map<String, dynamic>);
}



enum StockMovementCreateDTOTypeEnum {
@JsonValue(r'PURCHASE')
PURCHASE(r'PURCHASE'),
@JsonValue(r'SALE')
SALE(r'SALE'),
@JsonValue(r'WASTE')
WASTE(r'WASTE'),
@JsonValue(r'ADJUSTMENT')
ADJUSTMENT(r'ADJUSTMENT'),
@JsonValue(r'TRANSFER')
TRANSFER(r'TRANSFER'),
@JsonValue(r'RETURN')
RETURN(r'RETURN'),
@JsonValue(r'STOCK_COUNT_CORRECTION')
STOCK_COUNT_CORRECTION(r'STOCK_COUNT_CORRECTION');

const StockMovementCreateDTOTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




