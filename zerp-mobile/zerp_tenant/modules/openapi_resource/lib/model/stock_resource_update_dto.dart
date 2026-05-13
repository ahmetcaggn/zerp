//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_resource_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockResourceUpdateDTO extends Schema {
  /// Returns a new [StockResourceUpdateDTO] instance.
  StockResourceUpdateDTO({
    this.name,
    this.description,
    this.unitType,
    this.reorderThreshold,
    this.costPerUnit,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'unitType')
  final StockResourceUpdateDTOUnitTypeEnum? unitType;

  @JsonKey(name: r'reorderThreshold')
  final num? reorderThreshold;

  @JsonKey(name: r'costPerUnit')
  final num? costPerUnit;

  /// The factory instance for creating [StockResourceUpdateDTO] from JSON.
  static const factory = StockResourceUpdateDTOFactory();

  factory StockResourceUpdateDTO.fromJson(Map<String, dynamic> json) => _$StockResourceUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockResourceUpdateDTOToJson(this);

  static List<StockResourceUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockResourceUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, StockResourceUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockResourceUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockResourceUpdateDTOFactory extends JsonSchemaFactory<StockResourceUpdateDTO> {
  const StockResourceUpdateDTOFactory();

  @override
  StockResourceUpdateDTO fromJson(dynamic json) => StockResourceUpdateDTO.fromJson(json as Map<String, dynamic>);
}



enum StockResourceUpdateDTOUnitTypeEnum {
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

const StockResourceUpdateDTOUnitTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




