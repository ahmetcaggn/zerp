//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'tenant_name_check_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TenantNameCheckResponseDTO extends Schema {
  /// Returns a new [TenantNameCheckResponseDTO] instance.
  TenantNameCheckResponseDTO({
    this.name,
    this.available,
  });

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'available')
  final bool? available;

  /// The factory instance for creating [TenantNameCheckResponseDTO] from JSON.
  static const factory = TenantNameCheckResponseDTOFactory();

  factory TenantNameCheckResponseDTO.fromJson(Map<String, dynamic> json) => _$TenantNameCheckResponseDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TenantNameCheckResponseDTOToJson(this);

  static List<TenantNameCheckResponseDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TenantNameCheckResponseDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TenantNameCheckResponseDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TenantNameCheckResponseDTO> mapFromJson(dynamic json) {
    final map = <String, TenantNameCheckResponseDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TenantNameCheckResponseDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TenantNameCheckResponseDTOFactory extends JsonSchemaFactory<TenantNameCheckResponseDTO> {
  const TenantNameCheckResponseDTOFactory();

  @override
  TenantNameCheckResponseDTO fromJson(dynamic json) => TenantNameCheckResponseDTO.fromJson(json as Map<String, dynamic>);
}




