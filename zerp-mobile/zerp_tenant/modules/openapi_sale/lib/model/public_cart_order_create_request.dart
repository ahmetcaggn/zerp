//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'public_cart_order_item_create_request.dart';


part 'public_cart_order_create_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicCartOrderCreateRequest extends Schema {
  /// Returns a new [PublicCartOrderCreateRequest] instance.
  PublicCartOrderCreateRequest({
    this.note,
    this.items = const [],
  });

  @JsonKey(name: r'note')
  final String? note;

  @JsonKey(name: r'items')
  final List<PublicCartOrderItemCreateRequest> items;

  /// The factory instance for creating [PublicCartOrderCreateRequest] from JSON.
  static const factory = PublicCartOrderCreateRequestFactory();

  factory PublicCartOrderCreateRequest.fromJson(Map<String, dynamic> json) => _$PublicCartOrderCreateRequestFromJson(json);

  Map<String, dynamic> toJson() => _$PublicCartOrderCreateRequestToJson(this);

  static List<PublicCartOrderCreateRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicCartOrderCreateRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicCartOrderCreateRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicCartOrderCreateRequest> mapFromJson(dynamic json) {
    final map = <String, PublicCartOrderCreateRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicCartOrderCreateRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicCartOrderCreateRequestFactory extends JsonSchemaFactory<PublicCartOrderCreateRequest> {
  const PublicCartOrderCreateRequestFactory();

  @override
  PublicCartOrderCreateRequest fromJson(dynamic json) => PublicCartOrderCreateRequest.fromJson(json as Map<String, dynamic>);
}




