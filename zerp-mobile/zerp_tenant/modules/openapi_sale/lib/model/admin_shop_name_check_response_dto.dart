//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'admin_shop_name_check_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AdminShopNameCheckResponseDTO extends Schema {
  /// Returns a new [AdminShopNameCheckResponseDTO] instance.
  AdminShopNameCheckResponseDTO({
    this.tenantId,
    this.name,
    this.available,
  });

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'available')
  final bool? available;

  /// The factory instance for creating [AdminShopNameCheckResponseDTO] from JSON.
  static const factory = AdminShopNameCheckResponseDTOFactory();

  factory AdminShopNameCheckResponseDTO.fromJson(Map<String, dynamic> json) => _$AdminShopNameCheckResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$AdminShopNameCheckResponseDTOToJson(this);

  static List<AdminShopNameCheckResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AdminShopNameCheckResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AdminShopNameCheckResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AdminShopNameCheckResponseDTO> mapFromJson(dynamic json) {
    final map = <String, AdminShopNameCheckResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AdminShopNameCheckResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AdminShopNameCheckResponseDTOFactory extends JsonSchemaFactory<AdminShopNameCheckResponseDTO> {
  const AdminShopNameCheckResponseDTOFactory();

  @override
  AdminShopNameCheckResponseDTO fromJson(dynamic json) => AdminShopNameCheckResponseDTO.fromJson(json as Map<String, dynamic>);
}




