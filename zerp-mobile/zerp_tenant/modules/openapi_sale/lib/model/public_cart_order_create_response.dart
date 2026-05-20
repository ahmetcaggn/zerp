//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'public_cart_order_create_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicCartOrderCreateResponse extends Schema {
  /// Returns a new [PublicCartOrderCreateResponse] instance.
  PublicCartOrderCreateResponse({
    this.id,
    this.code,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'code')
  final String? code;

  /// The factory instance for creating [PublicCartOrderCreateResponse] from JSON.
  static const factory = PublicCartOrderCreateResponseFactory();

  factory PublicCartOrderCreateResponse.fromJson(Map<String, dynamic> json) => _$PublicCartOrderCreateResponseFromJson(json);

  Map<String, dynamic> toJson() => _$PublicCartOrderCreateResponseToJson(this);

  static List<PublicCartOrderCreateResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicCartOrderCreateResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicCartOrderCreateResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicCartOrderCreateResponse> mapFromJson(dynamic json) {
    final map = <String, PublicCartOrderCreateResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicCartOrderCreateResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicCartOrderCreateResponseFactory extends JsonSchemaFactory<PublicCartOrderCreateResponse> {
  const PublicCartOrderCreateResponseFactory();

  @override
  PublicCartOrderCreateResponse fromJson(dynamic json) => PublicCartOrderCreateResponse.fromJson(json as Map<String, dynamic>);
}




