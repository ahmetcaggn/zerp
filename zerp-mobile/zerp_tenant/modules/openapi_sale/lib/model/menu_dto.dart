//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'menu_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuDTO extends Schema {
  /// Returns a new [MenuDTO] instance.
  MenuDTO({
    this.id,
    this.name,
    this.description,
    this.language,
    this.shopId,
    this.shopName,
    this.tenantId,
    this.active,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'language')
  final MenuDTOLanguageEnum? language;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'shopName')
  final String? shopName;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  @JsonKey(name: r'active')
  final bool? active;

  /// The factory instance for creating [MenuDTO] from JSON.
  static const factory = MenuDTOFactory();

  factory MenuDTO.fromJson(Map<String, dynamic> json) => _$MenuDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuDTOToJson(this);

  static List<MenuDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuDTO> mapFromJson(dynamic json) {
    final map = <String, MenuDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuDTOFactory extends JsonSchemaFactory<MenuDTO> {
  const MenuDTOFactory();

  @override
  MenuDTO fromJson(dynamic json) => MenuDTO.fromJson(json as Map<String, dynamic>);
}



enum MenuDTOLanguageEnum {
@JsonValue('TR')
TR('TR'),
@JsonValue('EN')
EN('EN');

const MenuDTOLanguageEnum(this.value);

final String value;

@override
String toString() => value;
}




