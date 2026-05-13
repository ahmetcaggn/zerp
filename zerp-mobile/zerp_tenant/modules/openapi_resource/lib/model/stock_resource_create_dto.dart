//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_resource_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockResourceCreateDTO extends Schema {
  /// Returns a new [StockResourceCreateDTO] instance.
  StockResourceCreateDTO({
    this.name,
    this.description,
    this.shopId,
    this.unitType,
    this.quantity,
    this.reorderThreshold,
    this.costPerUnit,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'unitType')
  final StockResourceCreateDTOUnitTypeEnum? unitType;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'reorderThreshold')
  final num? reorderThreshold;

  @JsonKey(name: r'costPerUnit')
  final num? costPerUnit;

  /// The factory instance for creating [StockResourceCreateDTO] from JSON.
  static const factory = StockResourceCreateDTOFactory();

  factory StockResourceCreateDTO.fromJson(Map<String, dynamic> json) => _$StockResourceCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockResourceCreateDTOToJson(this);

  static List<StockResourceCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockResourceCreateDTO> mapFromJson(dynamic json) {
    final map = <String, StockResourceCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockResourceCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockResourceCreateDTOFactory extends JsonSchemaFactory<StockResourceCreateDTO> {
  const StockResourceCreateDTOFactory();

  @override
  StockResourceCreateDTO fromJson(dynamic json) => StockResourceCreateDTO.fromJson(json as Map<String, dynamic>);
}



enum StockResourceCreateDTOUnitTypeEnum {
@JsonValue(r'PIECE')
PIECE(r'PIECE'),
@JsonValue(r'GRAM')
GRAM(r'GRAM'),
@JsonValue(r'KILOGRAM')
KILOGRAM(r'KILOGRAM'),
@JsonValue(r'MILLILITER')
MILLILITER(r'MILLILITER'),
@JsonValue(r'LITER')
LITER(r'LITER');

const StockResourceCreateDTOUnitTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




