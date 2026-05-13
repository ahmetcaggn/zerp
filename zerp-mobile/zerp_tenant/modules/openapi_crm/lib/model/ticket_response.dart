//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'attachment_response.dart';
import 'comment_response.dart';
import 'sla_tracking_response.dart';
import 'ticket_assignment_response.dart';
import 'watcher_response.dart';


part 'ticket_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TicketResponse extends Schema {
  /// Returns a new [TicketResponse] instance.
  TicketResponse({
    this.id,
    this.title,
    this.description,
    this.status,
    this.priority,
    this.type,
    this.tenantId,
    this.reporterId,
    this.createdAt,
    this.updatedAt,
    this.resolvedAt,
    this.closedAt,
    this.tags = const {},
    this.customAttributes = const {},
    this.watchers = const {},
    this.attachments = const [],
    this.currentAssignment,
    this.comments = const [],
    this.slaTracking,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'title')
  final String? title;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'status')
  final String? status;

  @JsonKey(name: r'priority')
  final String? priority;

  @JsonKey(name: r'type')
  final String? type;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  @JsonKey(name: r'reporterId')
  final String? reporterId;

  @JsonKey(name: r'createdAt')
  final DateTime? createdAt;

  @JsonKey(name: r'updatedAt')
  final DateTime? updatedAt;

  @JsonKey(name: r'resolvedAt')
  final DateTime? resolvedAt;

  @JsonKey(name: r'closedAt')
  final DateTime? closedAt;

  @JsonKey(name: r'tags')
  final Set<String> tags;

  @JsonKey(name: r'customAttributes')
  final Map<String, Object> customAttributes;

  @JsonKey(name: r'watchers')
  final Set<WatcherResponse> watchers;

  @JsonKey(name: r'attachments')
  final List<AttachmentResponse> attachments;

  @JsonKey(name: r'currentAssignment')
  final TicketAssignmentResponse? currentAssignment;

  @JsonKey(name: r'comments')
  final List<CommentResponse> comments;

  @JsonKey(name: r'slaTracking')
  final SlaTrackingResponse? slaTracking;

  /// The factory instance for creating [TicketResponse] from JSON.
  static const factory = TicketResponseFactory();

  factory TicketResponse.fromJson(Map<String, dynamic> json) => _$TicketResponseFromJson(json);

  Map<String, dynamic> toJson() => _$TicketResponseToJson(this);

  static List<TicketResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TicketResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TicketResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TicketResponse> mapFromJson(dynamic json) {
    final map = <String, TicketResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TicketResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TicketResponseFactory extends JsonSchemaFactory<TicketResponse> {
  const TicketResponseFactory();

  @override
  TicketResponse fromJson(dynamic json) => TicketResponse.fromJson(json as Map<String, dynamic>);
}




