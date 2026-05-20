//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'menu_item_image_upload_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MenuItemImageUploadResponseDTO extends Schema {
  /// Returns a new [MenuItemImageUploadResponseDTO] instance.
  MenuItemImageUploadResponseDTO({
    this.imageId,
    this.contentType,
    this.originalFileName,
  });

  @JsonKey(name: r'imageId')
  final String? imageId;

  @JsonKey(name: r'contentType')
  final String? contentType;

  @JsonKey(name: r'originalFileName')
  final String? originalFileName;

  /// The factory instance for creating [MenuItemImageUploadResponseDTO] from JSON.
  static const factory = MenuItemImageUploadResponseDTOFactory();

  factory MenuItemImageUploadResponseDTO.fromJson(Map<String, dynamic> json) => _$MenuItemImageUploadResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$MenuItemImageUploadResponseDTOToJson(this);

  static List<MenuItemImageUploadResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuItemImageUploadResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuItemImageUploadResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuItemImageUploadResponseDTO> mapFromJson(dynamic json) {
    final map = <String, MenuItemImageUploadResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuItemImageUploadResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MenuItemImageUploadResponseDTOFactory extends JsonSchemaFactory<MenuItemImageUploadResponseDTO> {
  const MenuItemImageUploadResponseDTOFactory();

  @override
  MenuItemImageUploadResponseDTO fromJson(dynamic json) => MenuItemImageUploadResponseDTO.fromJson(json as Map<String, dynamic>);
}




