//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'public_active_menu_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicActiveMenuDTO extends Schema {
  /// Returns a new [PublicActiveMenuDTO] instance.
  PublicActiveMenuDTO({
    this.id,
    this.name,
    this.description,
    this.language,
    this.active,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'language')
  final PublicActiveMenuDTOLanguageEnum? language;

  @JsonKey(name: r'active')
  final bool? active;

  /// The factory instance for creating [PublicActiveMenuDTO] from JSON.
  static const factory = PublicActiveMenuDTOFactory();

  factory PublicActiveMenuDTO.fromJson(Map<String, dynamic> json) => _$PublicActiveMenuDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PublicActiveMenuDTOToJson(this);

  static List<PublicActiveMenuDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicActiveMenuDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicActiveMenuDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicActiveMenuDTO> mapFromJson(dynamic json) {
    final map = <String, PublicActiveMenuDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicActiveMenuDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicActiveMenuDTOFactory extends JsonSchemaFactory<PublicActiveMenuDTO> {
  const PublicActiveMenuDTOFactory();

  @override
  PublicActiveMenuDTO fromJson(dynamic json) => PublicActiveMenuDTO.fromJson(json as Map<String, dynamic>);
}



enum PublicActiveMenuDTOLanguageEnum {
@JsonValue('TR')
TR('TR'),
@JsonValue('EN')
EN('EN');

const PublicActiveMenuDTOLanguageEnum(this.value);

final String value;

@override
String toString() => value;
}




