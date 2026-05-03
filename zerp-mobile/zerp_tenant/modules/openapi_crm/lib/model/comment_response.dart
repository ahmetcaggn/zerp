//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'attachment_response.dart';

class CommentResponse extends Schema {
  /// Returns a new [CommentResponse] instance.
  CommentResponse({
    this.id,
    this.authorId,
    this.authorName,
    this.authorType,
    this.content,
    this.isInternal,
    this.createdAt,
    this.attachments = const [],
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
  final String? authorId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? authorName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? authorType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? content;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? isInternal;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? createdAt;

  final List<AttachmentResponse> attachments;

  /// The factory instance for creating [CommentResponse] from JSON.
  static const factory = CommentResponseFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is CommentResponse &&
    other.id == id &&
    other.authorId == authorId &&
    other.authorName == authorName &&
    other.authorType == authorType &&
    other.content == content &&
    other.isInternal == isInternal &&
    other.createdAt == createdAt &&
    other.attachments == attachments;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (authorId == null ? 0 : authorId!.hashCode) +
    (authorName == null ? 0 : authorName!.hashCode) +
    (authorType == null ? 0 : authorType!.hashCode) +
    (content == null ? 0 : content!.hashCode) +
    (isInternal == null ? 0 : isInternal!.hashCode) +
    (createdAt == null ? 0 : createdAt!.hashCode) +
    (attachments.hashCode);

  @override
  String toString() => 'CommentResponse[id=$id, authorId=$authorId, authorName=$authorName, authorType=$authorType, content=$content, isInternal=$isInternal, createdAt=$createdAt, attachments=$attachments]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.authorId != null) {
      json[r'authorId'] = this.authorId;
    } else {
      json[r'authorId'] = null;
    }
    if (this.authorName != null) {
      json[r'authorName'] = this.authorName;
    } else {
      json[r'authorName'] = null;
    }
    if (this.authorType != null) {
      json[r'authorType'] = this.authorType;
    } else {
      json[r'authorType'] = null;
    }
    if (this.content != null) {
      json[r'content'] = this.content;
    } else {
      json[r'content'] = null;
    }
    if (this.isInternal != null) {
      json[r'isInternal'] = this.isInternal;
    } else {
      json[r'isInternal'] = null;
    }
    if (this.createdAt != null) {
      json[r'createdAt'] = this.createdAt!.toUtc().toIso8601String();
    } else {
      json[r'createdAt'] = null;
    }
      json[r'attachments'] = this.attachments;
    return json;
  }

  /// Returns a new [CommentResponse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CommentResponse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "CommentResponse[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "CommentResponse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CommentResponse(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        authorId: json[r'authorId'] is String ? json[r'authorId'] as String : null,
        authorName: json[r'authorName'] is String ? json[r'authorName'] as String : null,
        authorType: json[r'authorType'] is String ? json[r'authorType'] as String : null,
        content: json[r'content'] is String ? json[r'content'] as String : null,
        isInternal: json[r'isInternal'] is bool ? json[r'isInternal'] as bool : null,
        createdAt: json[r'createdAt'] != null ? DateTime.parse(json[r'createdAt'].toString()) : null,
        attachments: AttachmentResponse.listFromJson(json[r'attachments']),
      );
    }
    return null;
  }

  static List<CommentResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CommentResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CommentResponse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CommentResponse> mapFromJson(dynamic json) {
    final map = <String, CommentResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CommentResponse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CommentResponse-objects as value to a dart map
  static Map<String, List<CommentResponse>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CommentResponse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CommentResponse.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [CommentResponse] instances from JSON data.
class CommentResponseFactory extends JsonSchemaFactory<CommentResponse> {
  const CommentResponseFactory();

  @override
  CommentResponse fromJson(dynamic json) => CommentResponse.fromJson(json)!;
}

