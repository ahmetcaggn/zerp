//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'menu_item_product_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuItemProductItemDTO extends Schema {
  /// Returns a new [MenuItemProductItemDTO] instance.
  MenuItemProductItemDTO({
    this.productId,
    this.quantity,
  });

  @JsonKey(name: r'productId')
  final String? productId;

  @JsonKey(name: r'quantity')
  final int? quantity;

  /// The factory instance for creating [MenuItemProductItemDTO] from JSON.
  static const factory = MenuItemProductItemDTOFactory();

  factory MenuItemProductItemDTO.fromJson(Map<String, dynamic> json) => _$MenuItemProductItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuItemProductItemDTOToJson(this);

  static List<MenuItemProductItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuItemProductItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuItemProductItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuItemProductItemDTO> mapFromJson(dynamic json) {
    final map = <String, MenuItemProductItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuItemProductItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuItemProductItemDTOFactory extends JsonSchemaFactory<MenuItemProductItemDTO> {
  const MenuItemProductItemDTOFactory();

  @override
  MenuItemProductItemDTO fromJson(dynamic json) => MenuItemProductItemDTO.fromJson(json as Map<String, dynamic>);
}




