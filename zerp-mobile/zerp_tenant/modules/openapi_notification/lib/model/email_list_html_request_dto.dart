//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class EmailListHtmlRequestDto extends Schema {
  /// Returns a new [EmailListHtmlRequestDto] instance.
  EmailListHtmlRequestDto({
    this.toList = const [],
    this.subject,
    this.plainTextBody,
    this.htmlBody,
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
  final String? plainTextBody;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? htmlBody;

  /// The factory instance for creating [EmailListHtmlRequestDto] from JSON.
  static const factory = EmailListHtmlRequestDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is EmailListHtmlRequestDto &&
    other.toList == toList &&
    other.subject == subject &&
    other.plainTextBody == plainTextBody &&
    other.htmlBody == htmlBody;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (toList.hashCode) +
    (subject == null ? 0 : subject!.hashCode) +
    (plainTextBody == null ? 0 : plainTextBody!.hashCode) +
    (htmlBody == null ? 0 : htmlBody!.hashCode);

  @override
  String toString() => 'EmailListHtmlRequestDto[toList=$toList, subject=$subject, plainTextBody=$plainTextBody, htmlBody=$htmlBody]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'toList'] = this.toList;
    if (this.subject != null) {
      json[r'subject'] = this.subject;
    } else {
      json[r'subject'] = null;
    }
    if (this.plainTextBody != null) {
      json[r'plainTextBody'] = this.plainTextBody;
    } else {
      json[r'plainTextBody'] = null;
    }
    if (this.htmlBody != null) {
      json[r'htmlBody'] = this.htmlBody;
    } else {
      json[r'htmlBody'] = null;
    }
    return json;
  }

  /// Returns a new [EmailListHtmlRequestDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static EmailListHtmlRequestDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "EmailListHtmlRequestDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "EmailListHtmlRequestDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return EmailListHtmlRequestDto(
        toList: json[r'toList'] is Iterable
            ? (json[r'toList'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        subject: json[r'subject'] is String ? json[r'subject'] as String : null,
        plainTextBody: json[r'plainTextBody'] is String ? json[r'plainTextBody'] as String : null,
        htmlBody: json[r'htmlBody'] is String ? json[r'htmlBody'] as String : null,
      );
    }
    return null;
  }

  static List<EmailListHtmlRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmailListHtmlRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmailListHtmlRequestDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmailListHtmlRequestDto> mapFromJson(dynamic json) {
    final map = <String, EmailListHtmlRequestDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmailListHtmlRequestDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of EmailListHtmlRequestDto-objects as value to a dart map
  static Map<String, List<EmailListHtmlRequestDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<EmailListHtmlRequestDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = EmailListHtmlRequestDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [EmailListHtmlRequestDto] instances from JSON data.
class EmailListHtmlRequestDtoFactory extends JsonSchemaFactory<EmailListHtmlRequestDto> {
  const EmailListHtmlRequestDtoFactory();

  @override
  EmailListHtmlRequestDto fromJson(dynamic json) => EmailListHtmlRequestDto.fromJson(json)!;
}

