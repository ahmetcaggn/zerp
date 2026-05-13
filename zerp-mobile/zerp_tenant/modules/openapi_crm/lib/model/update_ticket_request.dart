//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'update_ticket_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateTicketRequest extends Schema {
  /// Returns a new [UpdateTicketRequest] instance.
  UpdateTicketRequest({
    this.title,
    this.description,
  });

  @JsonKey(name: r'title')
  final String? title;

  @JsonKey(name: r'description')
  final String? description;

  /// The factory instance for creating [UpdateTicketRequest] from JSON.
  static const factory = UpdateTicketRequestFactory();

  factory UpdateTicketRequest.fromJson(Map<String, dynamic> json) => _$UpdateTicketRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateTicketRequestToJson(this);

  static List<UpdateTicketRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <UpdateTicketRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateTicketRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UpdateTicketRequest> mapFromJson(dynamic json) {
    final map = <String, UpdateTicketRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UpdateTicketRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class UpdateTicketRequestFactory extends JsonSchemaFactory<UpdateTicketRequest> {
  const UpdateTicketRequestFactory();

  @override
  UpdateTicketRequest fromJson(dynamic json) => UpdateTicketRequest.fromJson(json as Map<String, dynamic>);
}




