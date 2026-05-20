//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'public_active_menu_dto.dart';
import 'public_menu_category_dto.dart';


part 'public_shop_menu_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicShopMenuResponseDTO extends Schema {
  /// Returns a new [PublicShopMenuResponseDTO] instance.
  PublicShopMenuResponseDTO({
    this.shopId,
    this.activeMenu,
    this.categories = const [],
    this.message,
  });

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'activeMenu')
  final PublicActiveMenuDTO? activeMenu;

  @JsonKey(name: r'categories')
  final List<PublicMenuCategoryDTO> categories;

  @JsonKey(name: r'message')
  final String? message;

  /// The factory instance for creating [PublicShopMenuResponseDTO] from JSON.
  static const factory = PublicShopMenuResponseDTOFactory();

  factory PublicShopMenuResponseDTO.fromJson(Map<String, dynamic> json) => _$PublicShopMenuResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PublicShopMenuResponseDTOToJson(this);

  static List<PublicShopMenuResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicShopMenuResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicShopMenuResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicShopMenuResponseDTO> mapFromJson(dynamic json) {
    final map = <String, PublicShopMenuResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicShopMenuResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicShopMenuResponseDTOFactory extends JsonSchemaFactory<PublicShopMenuResponseDTO> {
  const PublicShopMenuResponseDTOFactory();

  @override
  PublicShopMenuResponseDTO fromJson(dynamic json) => PublicShopMenuResponseDTO.fromJson(json as Map<String, dynamic>);
}




