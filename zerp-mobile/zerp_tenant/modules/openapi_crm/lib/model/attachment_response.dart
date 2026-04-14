//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class AttachmentResponse extends Schema {
  /// Returns a new [AttachmentResponse] instance.
  AttachmentResponse({
    this.id,
    this.fileName,
    this.fileSize,
    this.contentType,
    this.storageKey,
    this.uploadedBy,
    this.uploadedAt,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? id;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? fileName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? fileSize;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? contentType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? storageKey;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? uploadedBy;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? uploadedAt;

  /// The factory instance for creating [AttachmentResponse] from JSON.
  static const factory = AttachmentResponseFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is AttachmentResponse &&
    other.id == id &&
    other.fileName == fileName &&
    other.fileSize == fileSize &&
    other.contentType == contentType &&
    other.storageKey == storageKey &&
    other.uploadedBy == uploadedBy &&
    other.uploadedAt == uploadedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (fileName == null ? 0 : fileName!.hashCode) +
    (fileSize == null ? 0 : fileSize!.hashCode) +
    (contentType == null ? 0 : contentType!.hashCode) +
    (storageKey == null ? 0 : storageKey!.hashCode) +
    (uploadedBy == null ? 0 : uploadedBy!.hashCode) +
    (uploadedAt == null ? 0 : uploadedAt!.hashCode);

  @override
  String toString() => 'AttachmentResponse[id=$id, fileName=$fileName, fileSize=$fileSize, contentType=$contentType, storageKey=$storageKey, uploadedBy=$uploadedBy, uploadedAt=$uploadedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.fileName != null) {
      json[r'fileName'] = this.fileName;
    } else {
      json[r'fileName'] = null;
    }
    if (this.fileSize != null) {
      json[r'fileSize'] = this.fileSize;
    } else {
      json[r'fileSize'] = null;
    }
    if (this.contentType != null) {
      json[r'contentType'] = this.contentType;
    } else {
      json[r'contentType'] = null;
    }
    if (this.storageKey != null) {
      json[r'storageKey'] = this.storageKey;
    } else {
      json[r'storageKey'] = null;
    }
    if (this.uploadedBy != null) {
      json[r'uploadedBy'] = this.uploadedBy;
    } else {
      json[r'uploadedBy'] = null;
    }
    if (this.uploadedAt != null) {
      json[r'uploadedAt'] = this.uploadedAt!.toUtc().toIso8601String();
    } else {
      json[r'uploadedAt'] = null;
    }
    return json;
  }

  /// Returns a new [AttachmentResponse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AttachmentResponse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "AttachmentResponse[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "AttachmentResponse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AttachmentResponse(
        id: json[r'id'] is int ? json[r'id'] as int : null,
        fileName: json[r'fileName'] is String ? json[r'fileName'] as String : null,
        fileSize: json[r'fileSize'] is int ? json[r'fileSize'] as int : null,
        contentType: json[r'contentType'] is String ? json[r'contentType'] as String : null,
        storageKey: json[r'storageKey'] is String ? json[r'storageKey'] as String : null,
        uploadedBy: json[r'uploadedBy'] is int ? json[r'uploadedBy'] as int : null,
        uploadedAt: json[r'uploadedAt'] != null ? DateTime.parse(json[r'uploadedAt'].toString()) : null,
      );
    }
    return null;
  }

  static List<AttachmentResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AttachmentResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AttachmentResponse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AttachmentResponse> mapFromJson(dynamic json) {
    final map = <String, AttachmentResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AttachmentResponse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AttachmentResponse-objects as value to a dart map
  static Map<String, List<AttachmentResponse>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<AttachmentResponse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AttachmentResponse.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [AttachmentResponse] instances from JSON data.
class AttachmentResponseFactory extends JsonSchemaFactory<AttachmentResponse> {
  const AttachmentResponseFactory();

  @override
  AttachmentResponse fromJson(dynamic json) => AttachmentResponse.fromJson(json)!;
}

