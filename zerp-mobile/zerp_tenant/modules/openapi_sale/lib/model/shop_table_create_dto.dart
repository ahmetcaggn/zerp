//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_table_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopTableCreateDTO extends Schema {
  /// Returns a new [ShopTableCreateDTO] instance.
  ShopTableCreateDTO({
    this.name,
    this.description,
    this.capacity,
    this.floor,
    this.status,
    this.shopId,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'capacity')
  final int? capacity;

  @JsonKey(name: r'floor')
  final int? floor;

  @JsonKey(name: r'status')
  final ShopTableCreateDTOStatusEnum? status;

  @JsonKey(name: r'shopId')
  final String? shopId;

  /// The factory instance for creating [ShopTableCreateDTO] from JSON.
  static const factory = ShopTableCreateDTOFactory();

  factory ShopTableCreateDTO.fromJson(Map<String, dynamic> json) => _$ShopTableCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopTableCreateDTOToJson(this);

  static List<ShopTableCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopTableCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopTableCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopTableCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ShopTableCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopTableCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopTableCreateDTOFactory extends JsonSchemaFactory<ShopTableCreateDTO> {
  const ShopTableCreateDTOFactory();

  @override
  ShopTableCreateDTO fromJson(dynamic json) => ShopTableCreateDTO.fromJson(json as Map<String, dynamic>);
}



enum ShopTableCreateDTOStatusEnum {
@JsonValue('AVAILABLE')
AVAILABLE('AVAILABLE'),
@JsonValue('RESERVED')
RESERVED('RESERVED'),
@JsonValue('OCCUPIED')
OCCUPIED('OCCUPIED'),
@JsonValue('OUT_OF_ORDER')
OUT_OF_ORDER('OUT_OF_ORDER');

const ShopTableCreateDTOStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




