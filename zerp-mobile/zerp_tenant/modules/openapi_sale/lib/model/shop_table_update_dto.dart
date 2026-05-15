//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_table_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopTableUpdateDTO extends Schema {
  /// Returns a new [ShopTableUpdateDTO] instance.
  ShopTableUpdateDTO({
    this.name,
    this.description,
    this.capacity,
    this.floor,
    this.status,
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
  final ShopTableUpdateDTOStatusEnum? status;

  /// The factory instance for creating [ShopTableUpdateDTO] from JSON.
  static const factory = ShopTableUpdateDTOFactory();

  factory ShopTableUpdateDTO.fromJson(Map<String, dynamic> json) => _$ShopTableUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopTableUpdateDTOToJson(this);

  static List<ShopTableUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopTableUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopTableUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopTableUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, ShopTableUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopTableUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopTableUpdateDTOFactory extends JsonSchemaFactory<ShopTableUpdateDTO> {
  const ShopTableUpdateDTOFactory();

  @override
  ShopTableUpdateDTO fromJson(dynamic json) => ShopTableUpdateDTO.fromJson(json as Map<String, dynamic>);
}



enum ShopTableUpdateDTOStatusEnum {
@JsonValue('AVAILABLE')
AVAILABLE('AVAILABLE'),
@JsonValue('RESERVED')
RESERVED('RESERVED'),
@JsonValue('OCCUPIED')
OCCUPIED('OCCUPIED'),
@JsonValue('OUT_OF_ORDER')
OUT_OF_ORDER('OUT_OF_ORDER');

const ShopTableUpdateDTOStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




