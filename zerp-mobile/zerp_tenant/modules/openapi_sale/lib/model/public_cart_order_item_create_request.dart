//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'public_cart_order_item_create_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PublicCartOrderItemCreateRequest extends Schema {
  /// Returns a new [PublicCartOrderItemCreateRequest] instance.
  PublicCartOrderItemCreateRequest({
    this.menuItemId,
    this.quantity,
    this.notes,
  });

  @JsonKey(name: r'menuItemId')
  final String? menuItemId;

  @JsonKey(name: r'quantity')
  final int? quantity;

  @JsonKey(name: r'notes')
  final String? notes;

  /// The factory instance for creating [PublicCartOrderItemCreateRequest] from JSON.
  static const factory = PublicCartOrderItemCreateRequestFactory();

  factory PublicCartOrderItemCreateRequest.fromJson(Map<String, dynamic> json) => _$PublicCartOrderItemCreateRequestFromJson(json);

  Map<String, dynamic> toJson() => _$PublicCartOrderItemCreateRequestToJson(this);

  static List<PublicCartOrderItemCreateRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PublicCartOrderItemCreateRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PublicCartOrderItemCreateRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PublicCartOrderItemCreateRequest> mapFromJson(dynamic json) {
    final map = <String, PublicCartOrderItemCreateRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PublicCartOrderItemCreateRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PublicCartOrderItemCreateRequestFactory extends JsonSchemaFactory<PublicCartOrderItemCreateRequest> {
  const PublicCartOrderItemCreateRequestFactory();

  @override
  PublicCartOrderItemCreateRequest fromJson(dynamic json) => PublicCartOrderItemCreateRequest.fromJson(json as Map<String, dynamic>);
}




