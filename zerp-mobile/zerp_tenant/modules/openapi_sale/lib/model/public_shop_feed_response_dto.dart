//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'public_shop_dto.dart';


part 'public_shop_feed_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicShopFeedResponseDTO extends Schema {
  /// Returns a new [PublicShopFeedResponseDTO] instance.
  PublicShopFeedResponseDTO({
    this.items = const [],
    this.page,
    this.pageSize,
    this.nextPage,
    this.totalPages,
    this.hasMore,
    this.total,
  });

  @JsonKey(name: r'items')
  final List<PublicShopDTO> items;

  @JsonKey(name: r'page')
  final int? page;

  @JsonKey(name: r'pageSize')
  final int? pageSize;

  @JsonKey(name: r'nextPage')
  final int? nextPage;

  @JsonKey(name: r'totalPages')
  final int? totalPages;

  @JsonKey(name: r'hasMore')
  final bool? hasMore;

  @JsonKey(name: r'total')
  final int? total;

  /// The factory instance for creating [PublicShopFeedResponseDTO] from JSON.
  static const factory = PublicShopFeedResponseDTOFactory();

  factory PublicShopFeedResponseDTO.fromJson(Map<String, dynamic> json) => _$PublicShopFeedResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PublicShopFeedResponseDTOToJson(this);

  static List<PublicShopFeedResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicShopFeedResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicShopFeedResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicShopFeedResponseDTO> mapFromJson(dynamic json) {
    final map = <String, PublicShopFeedResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicShopFeedResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicShopFeedResponseDTOFactory extends JsonSchemaFactory<PublicShopFeedResponseDTO> {
  const PublicShopFeedResponseDTOFactory();

  @override
  PublicShopFeedResponseDTO fromJson(dynamic json) => PublicShopFeedResponseDTO.fromJson(json as Map<String, dynamic>);
}




