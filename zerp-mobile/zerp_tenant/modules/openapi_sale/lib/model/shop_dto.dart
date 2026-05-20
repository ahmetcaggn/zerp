//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopDTO extends Schema {
  /// Returns a new [ShopDTO] instance.
  ShopDTO({
    this.id,
    this.name,
    this.description,
    this.defaultMenuLanguage,
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'defaultMenuLanguage')
  final ShopDTODefaultMenuLanguageEnum? defaultMenuLanguage;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [ShopDTO] from JSON.
  static const factory = ShopDTOFactory();

  factory ShopDTO.fromJson(Map<String, dynamic> json) => _$ShopDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopDTOToJson(this);

  static List<ShopDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopDTO> mapFromJson(dynamic json) {
    final map = <String, ShopDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopDTOFactory extends JsonSchemaFactory<ShopDTO> {
  const ShopDTOFactory();

  @override
  ShopDTO fromJson(dynamic json) => ShopDTO.fromJson(json as Map<String, dynamic>);
}



enum ShopDTODefaultMenuLanguageEnum {
@JsonValue('TR')
TR('TR'),
@JsonValue('EN')
EN('EN');

const ShopDTODefaultMenuLanguageEnum(this.value);

final String value;

@override
String toString() => value;
}




