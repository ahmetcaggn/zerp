//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_table_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopTableDTO extends Schema {
  /// Returns a new [ShopTableDTO] instance.
  ShopTableDTO({
    this.id,
    this.name,
    this.description,
    this.capacity,
    this.floor,
    this.status,
    this.shopId,
    this.shopName,
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'capacity')
  final int? capacity;

  @JsonKey(name: r'floor')
  final int? floor;

  @JsonKey(name: r'status')
  final ShopTableDTOStatusEnum? status;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'shopName')
  final String? shopName;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [ShopTableDTO] from JSON.
  static const factory = ShopTableDTOFactory();

  factory ShopTableDTO.fromJson(Map<String, dynamic> json) => _$ShopTableDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopTableDTOToJson(this);

  static List<ShopTableDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopTableDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopTableDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopTableDTO> mapFromJson(dynamic json) {
    final map = <String, ShopTableDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopTableDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopTableDTOFactory extends JsonSchemaFactory<ShopTableDTO> {
  const ShopTableDTOFactory();

  @override
  ShopTableDTO fromJson(dynamic json) => ShopTableDTO.fromJson(json as Map<String, dynamic>);
}



enum ShopTableDTOStatusEnum {
@JsonValue('AVAILABLE')
AVAILABLE('AVAILABLE'),
@JsonValue('RESERVED')
RESERVED('RESERVED'),
@JsonValue('OCCUPIED')
OCCUPIED('OCCUPIED'),
@JsonValue('OUT_OF_ORDER')
OUT_OF_ORDER('OUT_OF_ORDER');

const ShopTableDTOStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




