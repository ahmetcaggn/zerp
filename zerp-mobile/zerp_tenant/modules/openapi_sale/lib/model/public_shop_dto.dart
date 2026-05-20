//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'public_shop_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicShopDTO extends Schema {
  /// Returns a new [PublicShopDTO] instance.
  PublicShopDTO({
    this.id,
    this.tenantId,
    this.tenantName,
    this.name,
    this.description,
    this.imageId,
    this.address,
    this.city,
    this.state,
    this.country,
    this.postalCode,
    this.phone,
    this.email,
    this.website,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  @JsonKey(name: r'tenantName')
  final String? tenantName;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'imageId')
  final String? imageId;

  @JsonKey(name: r'address')
  final String? address;

  @JsonKey(name: r'city')
  final String? city;

  @JsonKey(name: r'state')
  final String? state;

  @JsonKey(name: r'country')
  final String? country;

  @JsonKey(name: r'postalCode')
  final String? postalCode;

  @JsonKey(name: r'phone')
  final String? phone;

  @JsonKey(name: r'email')
  final String? email;

  @JsonKey(name: r'website')
  final String? website;

  /// The factory instance for creating [PublicShopDTO] from JSON.
  static const factory = PublicShopDTOFactory();

  factory PublicShopDTO.fromJson(Map<String, dynamic> json) => _$PublicShopDTOFromJson(json);

  Map<String, dynamic> toJson() => _$PublicShopDTOToJson(this);

  static List<PublicShopDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicShopDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicShopDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicShopDTO> mapFromJson(dynamic json) {
    final map = <String, PublicShopDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicShopDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicShopDTOFactory extends JsonSchemaFactory<PublicShopDTO> {
  const PublicShopDTOFactory();

  @override
  PublicShopDTO fromJson(dynamic json) => PublicShopDTO.fromJson(json as Map<String, dynamic>);
}




