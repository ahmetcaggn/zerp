//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'admin_shop_update_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AdminShopUpdateRequestDTO extends Schema {
  /// Returns a new [AdminShopUpdateRequestDTO] instance.
  AdminShopUpdateRequestDTO({
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

  /// The factory instance for creating [AdminShopUpdateRequestDTO] from JSON.
  static const factory = AdminShopUpdateRequestDTOFactory();

  factory AdminShopUpdateRequestDTO.fromJson(Map<String, dynamic> json) => _$AdminShopUpdateRequestDTOFromJson(json);

  Map<String, dynamic> toJson() => _$AdminShopUpdateRequestDTOToJson(this);

  static List<AdminShopUpdateRequestDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AdminShopUpdateRequestDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AdminShopUpdateRequestDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AdminShopUpdateRequestDTO> mapFromJson(dynamic json) {
    final map = <String, AdminShopUpdateRequestDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AdminShopUpdateRequestDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AdminShopUpdateRequestDTOFactory extends JsonSchemaFactory<AdminShopUpdateRequestDTO> {
  const AdminShopUpdateRequestDTOFactory();

  @override
  AdminShopUpdateRequestDTO fromJson(dynamic json) => AdminShopUpdateRequestDTO.fromJson(json as Map<String, dynamic>);
}




