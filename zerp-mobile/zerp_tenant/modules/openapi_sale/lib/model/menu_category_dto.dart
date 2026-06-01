//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'menu_category_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuCategoryDTO extends Schema {
  /// Returns a new [MenuCategoryDTO] instance.
  MenuCategoryDTO({
    this.id,
    this.name,
    this.description,
    this.displayOrder,
    this.menuId,
    this.menuName,
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'displayOrder')
  final int? displayOrder;

  @JsonKey(name: r'menuId')
  final String? menuId;

  @JsonKey(name: r'menuName')
  final String? menuName;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [MenuCategoryDTO] from JSON.
  static const factory = MenuCategoryDTOFactory();

  factory MenuCategoryDTO.fromJson(Map<String, dynamic> json) => _$MenuCategoryDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuCategoryDTOToJson(this);

  static List<MenuCategoryDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuCategoryDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuCategoryDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuCategoryDTO> mapFromJson(dynamic json) {
    final map = <String, MenuCategoryDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuCategoryDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuCategoryDTOFactory extends JsonSchemaFactory<MenuCategoryDTO> {
  const MenuCategoryDTOFactory();

  @override
  MenuCategoryDTO fromJson(dynamic json) => MenuCategoryDTO.fromJson(json as Map<String, dynamic>);
}




