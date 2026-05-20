//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'public_menu_category_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicMenuCategoryDTO extends Schema {
  /// Returns a new [PublicMenuCategoryDTO] instance.
  PublicMenuCategoryDTO({
    this.id,
    this.name,
    this.description,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  /// The factory instance for creating [PublicMenuCategoryDTO] from JSON.
  static const factory = PublicMenuCategoryDTOFactory();

  factory PublicMenuCategoryDTO.fromJson(Map<String, dynamic> json) => _$PublicMenuCategoryDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PublicMenuCategoryDTOToJson(this);

  static List<PublicMenuCategoryDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicMenuCategoryDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicMenuCategoryDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicMenuCategoryDTO> mapFromJson(dynamic json) {
    final map = <String, PublicMenuCategoryDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicMenuCategoryDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicMenuCategoryDTOFactory extends JsonSchemaFactory<PublicMenuCategoryDTO> {
  const PublicMenuCategoryDTOFactory();

  @override
  PublicMenuCategoryDTO fromJson(dynamic json) => PublicMenuCategoryDTO.fromJson(json as Map<String, dynamic>);
}




