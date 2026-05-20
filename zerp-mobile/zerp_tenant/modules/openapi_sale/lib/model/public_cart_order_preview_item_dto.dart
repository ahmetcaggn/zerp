//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'public_cart_order_preview_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicCartOrderPreviewItemDTO extends Schema {
  /// Returns a new [PublicCartOrderPreviewItemDTO] instance.
  PublicCartOrderPreviewItemDTO({
    this.menuItemId,
    this.menuItemName,
    this.quantity,
    this.unitPrice,
    this.notes,
  });

  @JsonKey(name: r'menuItemId')
  final String? menuItemId;

  @JsonKey(name: r'menuItemName')
  final String? menuItemName;

  @JsonKey(name: r'quantity')
  final int? quantity;

  @JsonKey(name: r'unitPrice')
  final num? unitPrice;

  @JsonKey(name: r'notes')
  final String? notes;

  /// The factory instance for creating [PublicCartOrderPreviewItemDTO] from JSON.
  static const factory = PublicCartOrderPreviewItemDTOFactory();

  factory PublicCartOrderPreviewItemDTO.fromJson(Map<String, dynamic> json) => _$PublicCartOrderPreviewItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PublicCartOrderPreviewItemDTOToJson(this);

  static List<PublicCartOrderPreviewItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicCartOrderPreviewItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicCartOrderPreviewItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicCartOrderPreviewItemDTO> mapFromJson(dynamic json) {
    final map = <String, PublicCartOrderPreviewItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicCartOrderPreviewItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicCartOrderPreviewItemDTOFactory extends JsonSchemaFactory<PublicCartOrderPreviewItemDTO> {
  const PublicCartOrderPreviewItemDTOFactory();

  @override
  PublicCartOrderPreviewItemDTO fromJson(dynamic json) => PublicCartOrderPreviewItemDTO.fromJson(json as Map<String, dynamic>);
}




