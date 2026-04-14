//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class Meta extends Schema {
  /// Returns a new [Meta] instance.
  Meta({
    this.traceId,
    this.path,
    this.durationMs,
    this.version,
    this.timestamp,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? traceId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? path;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? durationMs;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? version;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? timestamp;

  /// The factory instance for creating [Meta] from JSON.
  static const factory = MetaFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is Meta &&
    other.traceId == traceId &&
    other.path == path &&
    other.durationMs == durationMs &&
    other.version == version &&
    other.timestamp == timestamp;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (traceId == null ? 0 : traceId!.hashCode) +
    (path == null ? 0 : path!.hashCode) +
    (durationMs == null ? 0 : durationMs!.hashCode) +
    (version == null ? 0 : version!.hashCode) +
    (timestamp == null ? 0 : timestamp!.hashCode);

  @override
  String toString() => 'Meta[traceId=$traceId, path=$path, durationMs=$durationMs, version=$version, timestamp=$timestamp]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.traceId != null) {
      json[r'traceId'] = this.traceId;
    } else {
      json[r'traceId'] = null;
    }
    if (this.path != null) {
      json[r'path'] = this.path;
    } else {
      json[r'path'] = null;
    }
    if (this.durationMs != null) {
      json[r'durationMs'] = this.durationMs;
    } else {
      json[r'durationMs'] = null;
    }
    if (this.version != null) {
      json[r'version'] = this.version;
    } else {
      json[r'version'] = null;
    }
    if (this.timestamp != null) {
      json[r'timestamp'] = this.timestamp!.toUtc().toIso8601String();
    } else {
      json[r'timestamp'] = null;
    }
    return json;
  }

  /// Returns a new [Meta] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Meta? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "Meta[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "Meta[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Meta(
        traceId: json[r'traceId'] is String ? json[r'traceId'] as String : null,
        path: json[r'path'] is String ? json[r'path'] as String : null,
        durationMs: json[r'durationMs'] is int ? json[r'durationMs'] as int : null,
        version: json[r'version'] is String ? json[r'version'] as String : null,
        timestamp: json[r'timestamp'] != null ? DateTime.parse(json[r'timestamp'].toString()) : null,
      );
    }
    return null;
  }

  static List<Meta> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <Meta>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Meta.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Meta> mapFromJson(dynamic json) {
    final map = <String, Meta>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Meta.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Meta-objects as value to a dart map
  static Map<String, List<Meta>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<Meta>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Meta.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [Meta] instances from JSON data.
class MetaFactory extends JsonSchemaFactory<Meta> {
  const MetaFactory();

  @override
  Meta fromJson(dynamic json) => Meta.fromJson(json)!;
}

