//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class EmailListRequestDto extends Schema {
  /// Returns a new [EmailListRequestDto] instance.
  EmailListRequestDto({
    this.toList = const [],
    this.subject,
    this.body,
  });

  final List<String> toList;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? subject;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? body;

  /// The factory instance for creating [EmailListRequestDto] from JSON.
  static const factory = EmailListRequestDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is EmailListRequestDto &&
    other.toList == toList &&
    other.subject == subject &&
    other.body == body;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (toList.hashCode) +
    (subject == null ? 0 : subject!.hashCode) +
    (body == null ? 0 : body!.hashCode);

  @override
  String toString() => 'EmailListRequestDto[toList=$toList, subject=$subject, body=$body]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'toList'] = this.toList;
    if (this.subject != null) {
      json[r'subject'] = this.subject;
    } else {
      json[r'subject'] = null;
    }
    if (this.body != null) {
      json[r'body'] = this.body;
    } else {
      json[r'body'] = null;
    }
    return json;
  }

  /// Returns a new [EmailListRequestDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static EmailListRequestDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "EmailListRequestDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "EmailListRequestDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return EmailListRequestDto(
        toList: json[r'toList'] is Iterable
            ? (json[r'toList'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        subject: json[r'subject'] is String ? json[r'subject'] as String : null,
        body: json[r'body'] is String ? json[r'body'] as String : null,
      );
    }
    return null;
  }

  static List<EmailListRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmailListRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmailListRequestDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmailListRequestDto> mapFromJson(dynamic json) {
    final map = <String, EmailListRequestDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmailListRequestDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of EmailListRequestDto-objects as value to a dart map
  static Map<String, List<EmailListRequestDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<EmailListRequestDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = EmailListRequestDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [EmailListRequestDto] instances from JSON data.
class EmailListRequestDtoFactory extends JsonSchemaFactory<EmailListRequestDto> {
  const EmailListRequestDtoFactory();

  @override
  EmailListRequestDto fromJson(dynamic json) => EmailListRequestDto.fromJson(json)!;
}

