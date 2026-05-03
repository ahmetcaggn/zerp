//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'attachment_response.dart';
import 'comment_response.dart';
import 'sla_tracking_response.dart';
import 'ticket_assignment_response.dart';
import 'watcher_response.dart';

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

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? id;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? title;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? description;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? status;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? priority;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? tenantId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? reporterId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? createdAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? updatedAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? resolvedAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? closedAt;

  final Set<String> tags;

  final Map<String, Object> customAttributes;

  final Set<WatcherResponse> watchers;

  final List<AttachmentResponse> attachments;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final TicketAssignmentResponse? currentAssignment;

  final List<CommentResponse> comments;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final SlaTrackingResponse? slaTracking;

  /// The factory instance for creating [TicketResponse] from JSON.
  static const factory = TicketResponseFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is TicketResponse &&
    other.id == id &&
    other.title == title &&
    other.description == description &&
    other.status == status &&
    other.priority == priority &&
    other.type == type &&
    other.tenantId == tenantId &&
    other.reporterId == reporterId &&
    other.createdAt == createdAt &&
    other.updatedAt == updatedAt &&
    other.resolvedAt == resolvedAt &&
    other.closedAt == closedAt &&
    other.tags == tags &&
    other.customAttributes == customAttributes &&
    other.watchers == watchers &&
    other.attachments == attachments &&
    other.currentAssignment == currentAssignment &&
    other.comments == comments &&
    other.slaTracking == slaTracking;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (title == null ? 0 : title!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (status == null ? 0 : status!.hashCode) +
    (priority == null ? 0 : priority!.hashCode) +
    (type == null ? 0 : type!.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode) +
    (reporterId == null ? 0 : reporterId!.hashCode) +
    (createdAt == null ? 0 : createdAt!.hashCode) +
    (updatedAt == null ? 0 : updatedAt!.hashCode) +
    (resolvedAt == null ? 0 : resolvedAt!.hashCode) +
    (closedAt == null ? 0 : closedAt!.hashCode) +
    (tags.hashCode) +
    (customAttributes.hashCode) +
    (watchers.hashCode) +
    (attachments.hashCode) +
    (currentAssignment == null ? 0 : currentAssignment!.hashCode) +
    (comments.hashCode) +
    (slaTracking == null ? 0 : slaTracking!.hashCode);

  @override
  String toString() => 'TicketResponse[id=$id, title=$title, description=$description, status=$status, priority=$priority, type=$type, tenantId=$tenantId, reporterId=$reporterId, createdAt=$createdAt, updatedAt=$updatedAt, resolvedAt=$resolvedAt, closedAt=$closedAt, tags=$tags, customAttributes=$customAttributes, watchers=$watchers, attachments=$attachments, currentAssignment=$currentAssignment, comments=$comments, slaTracking=$slaTracking]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.title != null) {
      json[r'title'] = this.title;
    } else {
      json[r'title'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.status != null) {
      json[r'status'] = this.status;
    } else {
      json[r'status'] = null;
    }
    if (this.priority != null) {
      json[r'priority'] = this.priority;
    } else {
      json[r'priority'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    if (this.reporterId != null) {
      json[r'reporterId'] = this.reporterId;
    } else {
      json[r'reporterId'] = null;
    }
    if (this.createdAt != null) {
      json[r'createdAt'] = this.createdAt!.toUtc().toIso8601String();
    } else {
      json[r'createdAt'] = null;
    }
    if (this.updatedAt != null) {
      json[r'updatedAt'] = this.updatedAt!.toUtc().toIso8601String();
    } else {
      json[r'updatedAt'] = null;
    }
    if (this.resolvedAt != null) {
      json[r'resolvedAt'] = this.resolvedAt!.toUtc().toIso8601String();
    } else {
      json[r'resolvedAt'] = null;
    }
    if (this.closedAt != null) {
      json[r'closedAt'] = this.closedAt!.toUtc().toIso8601String();
    } else {
      json[r'closedAt'] = null;
    }
      json[r'tags'] = this.tags.toList(growable: false);
      json[r'customAttributes'] = this.customAttributes;
      json[r'watchers'] = this.watchers.toList(growable: false);
      json[r'attachments'] = this.attachments;
    if (this.currentAssignment != null) {
      json[r'currentAssignment'] = this.currentAssignment;
    } else {
      json[r'currentAssignment'] = null;
    }
      json[r'comments'] = this.comments;
    if (this.slaTracking != null) {
      json[r'slaTracking'] = this.slaTracking;
    } else {
      json[r'slaTracking'] = null;
    }
    return json;
  }

  /// Returns a new [TicketResponse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TicketResponse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "TicketResponse[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "TicketResponse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TicketResponse(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        title: json[r'title'] is String ? json[r'title'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        status: json[r'status'] is String ? json[r'status'] as String : null,
        priority: json[r'priority'] is String ? json[r'priority'] as String : null,
        type: json[r'type'] is String ? json[r'type'] as String : null,
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
        reporterId: json[r'reporterId'] is String ? json[r'reporterId'] as String : null,
        createdAt: json[r'createdAt'] != null ? DateTime.parse(json[r'createdAt'].toString()) : null,
        updatedAt: json[r'updatedAt'] != null ? DateTime.parse(json[r'updatedAt'].toString()) : null,
        resolvedAt: json[r'resolvedAt'] != null ? DateTime.parse(json[r'resolvedAt'].toString()) : null,
        closedAt: json[r'closedAt'] != null ? DateTime.parse(json[r'closedAt'].toString()) : null,
        tags: json[r'tags'] is Iterable
            ? (json[r'tags'] as Iterable).cast<String>().toSet()
            : const {},
        customAttributes: json[r'customAttributes'] == null ? const {} : (json[r'customAttributes'] as Map).cast<String, Object>(),
        watchers: WatcherResponse.listFromJson(json[r'watchers']).toSet(),
        attachments: AttachmentResponse.listFromJson(json[r'attachments']),
        currentAssignment: TicketAssignmentResponse.fromJson(json[r'currentAssignment']),
        comments: CommentResponse.listFromJson(json[r'comments']),
        slaTracking: SlaTrackingResponse.fromJson(json[r'slaTracking']),
      );
    }
    return null;
  }

  static List<TicketResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TicketResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TicketResponse.fromJson(row);
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
        final value = TicketResponse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TicketResponse-objects as value to a dart map
  static Map<String, List<TicketResponse>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<TicketResponse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TicketResponse.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [TicketResponse] instances from JSON data.
class TicketResponseFactory extends JsonSchemaFactory<TicketResponse> {
  const TicketResponseFactory();

  @override
  TicketResponse fromJson(dynamic json) => TicketResponse.fromJson(json)!;
}

