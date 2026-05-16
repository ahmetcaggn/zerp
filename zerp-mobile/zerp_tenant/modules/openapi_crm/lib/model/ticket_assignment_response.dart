//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'ticket_assignment_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TicketAssignmentResponse extends Schema {
  /// Returns a new [TicketAssignmentResponse] instance.
  TicketAssignmentResponse({
    this.id,
    this.teamId,
    this.agentPartyId,
    this.active,
    this.assignedAt,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'teamId')
  final String? teamId;

  @JsonKey(name: r'agentPartyId')
  final String? agentPartyId;

  @JsonKey(name: r'active')
  final bool? active;

  @JsonKey(name: r'assignedAt')
  final DateTime? assignedAt;

  /// The factory instance for creating [TicketAssignmentResponse] from JSON.
  static const factory = TicketAssignmentResponseFactory();

  factory TicketAssignmentResponse.fromJson(Map<String, dynamic> json) => _$TicketAssignmentResponseFromJson(json);

  Map<String, dynamic> toJson() => _$TicketAssignmentResponseToJson(this);

  static List<TicketAssignmentResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TicketAssignmentResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TicketAssignmentResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TicketAssignmentResponse> mapFromJson(dynamic json) {
    final map = <String, TicketAssignmentResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TicketAssignmentResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TicketAssignmentResponseFactory extends JsonSchemaFactory<TicketAssignmentResponse> {
  const TicketAssignmentResponseFactory();

  @override
  TicketAssignmentResponse fromJson(dynamic json) => TicketAssignmentResponse.fromJson(json as Map<String, dynamic>);
}




