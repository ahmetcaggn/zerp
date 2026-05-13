//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'assign_ticket_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AssignTicketRequest extends Schema {
  /// Returns a new [AssignTicketRequest] instance.
  AssignTicketRequest({
    this.teamId,
    this.agentPartyId,
  });

  @JsonKey(name: r'teamId')
  final String? teamId;

  @JsonKey(name: r'agentPartyId')
  final String? agentPartyId;

  /// The factory instance for creating [AssignTicketRequest] from JSON.
  static const factory = AssignTicketRequestFactory();

  factory AssignTicketRequest.fromJson(Map<String, dynamic> json) => _$AssignTicketRequestFromJson(json);

  Map<String, dynamic> toJson() => _$AssignTicketRequestToJson(this);

  static List<AssignTicketRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AssignTicketRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AssignTicketRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AssignTicketRequest> mapFromJson(dynamic json) {
    final map = <String, AssignTicketRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AssignTicketRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AssignTicketRequestFactory extends JsonSchemaFactory<AssignTicketRequest> {
  const AssignTicketRequestFactory();

  @override
  AssignTicketRequest fromJson(dynamic json) => AssignTicketRequest.fromJson(json as Map<String, dynamic>);
}




