//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class AddCommentRequest extends Schema {
  /// Returns a new [AddCommentRequest] instance.
  AddCommentRequest({
    this.content,
    this.isInternal,
  });

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

  /// The factory instance for creating [AddCommentRequest] from JSON.
  static const factory = AddCommentRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is AddCommentRequest &&
    other.content == content &&
    other.isInternal == isInternal;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (content == null ? 0 : content!.hashCode) +
    (isInternal == null ? 0 : isInternal!.hashCode);

  @override
  String toString() => 'AddCommentRequest[content=$content, isInternal=$isInternal]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
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
    return json;
  }

  /// Returns a new [AddCommentRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AddCommentRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "AddCommentRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "AddCommentRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AddCommentRequest(
        content: json[r'content'] is String ? json[r'content'] as String : null,
        isInternal: json[r'isInternal'] is bool ? json[r'isInternal'] as bool : null,
      );
    }
    return null;
  }

  static List<AddCommentRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AddCommentRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AddCommentRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AddCommentRequest> mapFromJson(dynamic json) {
    final map = <String, AddCommentRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AddCommentRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AddCommentRequest-objects as value to a dart map
  static Map<String, List<AddCommentRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<AddCommentRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AddCommentRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [AddCommentRequest] instances from JSON data.
class AddCommentRequestFactory extends JsonSchemaFactory<AddCommentRequest> {
  const AddCommentRequestFactory();

  @override
  AddCommentRequest fromJson(dynamic json) => AddCommentRequest.fromJson(json)!;
}

