//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'public_cart_order_preview_item_dto.dart';


part 'public_cart_order_preview_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicCartOrderPreviewDTO extends Schema {
  /// Returns a new [PublicCartOrderPreviewDTO] instance.
  PublicCartOrderPreviewDTO({
    this.id,
    this.code,
    this.shopId,
    this.note,
    this.items = const [],
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'code')
  final String? code;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'note')
  final String? note;

  @JsonKey(name: r'items')
  final List<PublicCartOrderPreviewItemDTO> items;

  /// The factory instance for creating [PublicCartOrderPreviewDTO] from JSON.
  static const factory = PublicCartOrderPreviewDTOFactory();

  factory PublicCartOrderPreviewDTO.fromJson(Map<String, dynamic> json) => _$PublicCartOrderPreviewDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PublicCartOrderPreviewDTOToJson(this);

  static List<PublicCartOrderPreviewDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicCartOrderPreviewDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicCartOrderPreviewDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicCartOrderPreviewDTO> mapFromJson(dynamic json) {
    final map = <String, PublicCartOrderPreviewDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicCartOrderPreviewDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicCartOrderPreviewDTOFactory extends JsonSchemaFactory<PublicCartOrderPreviewDTO> {
  const PublicCartOrderPreviewDTOFactory();

  @override
  PublicCartOrderPreviewDTO fromJson(dynamic json) => PublicCartOrderPreviewDTO.fromJson(json as Map<String, dynamic>);
}




