//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class SlaTrackingResponse extends Schema {
  /// Returns a new [SlaTrackingResponse] instance.
  SlaTrackingResponse({
    this.firstResponseDueAt,
    this.firstResponseAt,
    this.isFirstResponseBreached,
    this.resolutionDueAt,
    this.resolutionAt,
    this.isResolutionBreached,
    this.totalPausedTimeMinutes,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? firstResponseDueAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? firstResponseAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? isFirstResponseBreached;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? resolutionDueAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? resolutionAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? isResolutionBreached;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? totalPausedTimeMinutes;

  /// The factory instance for creating [SlaTrackingResponse] from JSON.
  static const factory = SlaTrackingResponseFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is SlaTrackingResponse &&
    other.firstResponseDueAt == firstResponseDueAt &&
    other.firstResponseAt == firstResponseAt &&
    other.isFirstResponseBreached == isFirstResponseBreached &&
    other.resolutionDueAt == resolutionDueAt &&
    other.resolutionAt == resolutionAt &&
    other.isResolutionBreached == isResolutionBreached &&
    other.totalPausedTimeMinutes == totalPausedTimeMinutes;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (firstResponseDueAt == null ? 0 : firstResponseDueAt!.hashCode) +
    (firstResponseAt == null ? 0 : firstResponseAt!.hashCode) +
    (isFirstResponseBreached == null ? 0 : isFirstResponseBreached!.hashCode) +
    (resolutionDueAt == null ? 0 : resolutionDueAt!.hashCode) +
    (resolutionAt == null ? 0 : resolutionAt!.hashCode) +
    (isResolutionBreached == null ? 0 : isResolutionBreached!.hashCode) +
    (totalPausedTimeMinutes == null ? 0 : totalPausedTimeMinutes!.hashCode);

  @override
  String toString() => 'SlaTrackingResponse[firstResponseDueAt=$firstResponseDueAt, firstResponseAt=$firstResponseAt, isFirstResponseBreached=$isFirstResponseBreached, resolutionDueAt=$resolutionDueAt, resolutionAt=$resolutionAt, isResolutionBreached=$isResolutionBreached, totalPausedTimeMinutes=$totalPausedTimeMinutes]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.firstResponseDueAt != null) {
      json[r'firstResponseDueAt'] = this.firstResponseDueAt!.toUtc().toIso8601String();
    } else {
      json[r'firstResponseDueAt'] = null;
    }
    if (this.firstResponseAt != null) {
      json[r'firstResponseAt'] = this.firstResponseAt!.toUtc().toIso8601String();
    } else {
      json[r'firstResponseAt'] = null;
    }
    if (this.isFirstResponseBreached != null) {
      json[r'isFirstResponseBreached'] = this.isFirstResponseBreached;
    } else {
      json[r'isFirstResponseBreached'] = null;
    }
    if (this.resolutionDueAt != null) {
      json[r'resolutionDueAt'] = this.resolutionDueAt!.toUtc().toIso8601String();
    } else {
      json[r'resolutionDueAt'] = null;
    }
    if (this.resolutionAt != null) {
      json[r'resolutionAt'] = this.resolutionAt!.toUtc().toIso8601String();
    } else {
      json[r'resolutionAt'] = null;
    }
    if (this.isResolutionBreached != null) {
      json[r'isResolutionBreached'] = this.isResolutionBreached;
    } else {
      json[r'isResolutionBreached'] = null;
    }
    if (this.totalPausedTimeMinutes != null) {
      json[r'totalPausedTimeMinutes'] = this.totalPausedTimeMinutes;
    } else {
      json[r'totalPausedTimeMinutes'] = null;
    }
    return json;
  }

  /// Returns a new [SlaTrackingResponse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SlaTrackingResponse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "SlaTrackingResponse[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "SlaTrackingResponse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SlaTrackingResponse(
        firstResponseDueAt: json[r'firstResponseDueAt'] != null ? DateTime.parse(json[r'firstResponseDueAt'].toString()) : null,
        firstResponseAt: json[r'firstResponseAt'] != null ? DateTime.parse(json[r'firstResponseAt'].toString()) : null,
        isFirstResponseBreached: json[r'isFirstResponseBreached'] is bool ? json[r'isFirstResponseBreached'] as bool : null,
        resolutionDueAt: json[r'resolutionDueAt'] != null ? DateTime.parse(json[r'resolutionDueAt'].toString()) : null,
        resolutionAt: json[r'resolutionAt'] != null ? DateTime.parse(json[r'resolutionAt'].toString()) : null,
        isResolutionBreached: json[r'isResolutionBreached'] is bool ? json[r'isResolutionBreached'] as bool : null,
        totalPausedTimeMinutes: json[r'totalPausedTimeMinutes'] is int ? json[r'totalPausedTimeMinutes'] as int : null,
      );
    }
    return null;
  }

  static List<SlaTrackingResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SlaTrackingResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SlaTrackingResponse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SlaTrackingResponse> mapFromJson(dynamic json) {
    final map = <String, SlaTrackingResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SlaTrackingResponse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SlaTrackingResponse-objects as value to a dart map
  static Map<String, List<SlaTrackingResponse>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<SlaTrackingResponse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SlaTrackingResponse.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [SlaTrackingResponse] instances from JSON data.
class SlaTrackingResponseFactory extends JsonSchemaFactory<SlaTrackingResponse> {
  const SlaTrackingResponseFactory();

  @override
  SlaTrackingResponse fromJson(dynamic json) => SlaTrackingResponse.fromJson(json)!;
}

