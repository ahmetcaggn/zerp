//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'tenant_image_upload_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TenantImageUploadResponseDTO extends Schema {
  /// Returns a new [TenantImageUploadResponseDTO] instance.
  TenantImageUploadResponseDTO({
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

  /// The factory instance for creating [TenantImageUploadResponseDTO] from JSON.
  static const factory = TenantImageUploadResponseDTOFactory();

  factory TenantImageUploadResponseDTO.fromJson(Map<String, dynamic> json) => _$TenantImageUploadResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TenantImageUploadResponseDTOToJson(this);

  static List<TenantImageUploadResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TenantImageUploadResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TenantImageUploadResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TenantImageUploadResponseDTO> mapFromJson(dynamic json) {
    final map = <String, TenantImageUploadResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TenantImageUploadResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TenantImageUploadResponseDTOFactory extends JsonSchemaFactory<TenantImageUploadResponseDTO> {
  const TenantImageUploadResponseDTOFactory();

  @override
  TenantImageUploadResponseDTO fromJson(dynamic json) => TenantImageUploadResponseDTO.fromJson(json as Map<String, dynamic>);
}




