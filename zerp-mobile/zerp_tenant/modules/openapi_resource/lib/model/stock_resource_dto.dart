//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_resource_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockResourceDTO extends Schema {
  /// Returns a new [StockResourceDTO] instance.
  StockResourceDTO({
    this.id,
    this.name,
    this.description,
    this.shopId,
    this.shopName,
    this.unitType,
    this.quantity,
    this.reorderThreshold,
    this.costPerUnit,
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'shopName')
  final String? shopName;

  @JsonKey(name: r'unitType')
  final StockResourceDTOUnitTypeEnum? unitType;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'reorderThreshold')
  final num? reorderThreshold;

  @JsonKey(name: r'costPerUnit')
  final num? costPerUnit;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [StockResourceDTO] from JSON.
  static const factory = StockResourceDTOFactory();

  factory StockResourceDTO.fromJson(Map<String, dynamic> json) => _$StockResourceDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockResourceDTOToJson(this);

  static List<StockResourceDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockResourceDTO> mapFromJson(dynamic json) {
    final map = <String, StockResourceDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockResourceDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockResourceDTOFactory extends JsonSchemaFactory<StockResourceDTO> {
  const StockResourceDTOFactory();

  @override
  StockResourceDTO fromJson(dynamic json) => StockResourceDTO.fromJson(json as Map<String, dynamic>);
}



enum StockResourceDTOUnitTypeEnum {
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

const StockResourceDTOUnitTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




