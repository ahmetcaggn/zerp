//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_image_upload_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopImageUploadResponseDTO extends Schema {
  /// Returns a new [ShopImageUploadResponseDTO] instance.
  ShopImageUploadResponseDTO({
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

  /// The factory instance for creating [ShopImageUploadResponseDTO] from JSON.
  static const factory = ShopImageUploadResponseDTOFactory();

  factory ShopImageUploadResponseDTO.fromJson(Map<String, dynamic> json) => _$ShopImageUploadResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopImageUploadResponseDTOToJson(this);

  static List<ShopImageUploadResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopImageUploadResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopImageUploadResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopImageUploadResponseDTO> mapFromJson(dynamic json) {
    final map = <String, ShopImageUploadResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopImageUploadResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopImageUploadResponseDTOFactory extends JsonSchemaFactory<ShopImageUploadResponseDTO> {
  const ShopImageUploadResponseDTOFactory();

  @override
  ShopImageUploadResponseDTO fromJson(dynamic json) => ShopImageUploadResponseDTO.fromJson(json as Map<String, dynamic>);
}




