//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'email_list_html_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class EmailListHtmlRequestDto extends Schema {
  /// Returns a new [EmailListHtmlRequestDto] instance.
  EmailListHtmlRequestDto({
    this.toList = const [],
    this.subject,
    this.plainTextBody,
    this.htmlBody,
  });

  @JsonKey(name: r'toList')
  final List<String> toList;

  @JsonKey(name: r'subject')
  final String? subject;

  @JsonKey(name: r'plainTextBody')
  final String? plainTextBody;

  @JsonKey(name: r'htmlBody')
  final String? htmlBody;

  /// The factory instance for creating [EmailListHtmlRequestDto] from JSON.
  static const factory = EmailListHtmlRequestDtoFactory();

  factory EmailListHtmlRequestDto.fromJson(Map<String, dynamic> json) => _$EmailListHtmlRequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$EmailListHtmlRequestDtoToJson(this);

  static List<EmailListHtmlRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmailListHtmlRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmailListHtmlRequestDto.fromJson(row as Map<String, dynamic>);
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
        final value = EmailListHtmlRequestDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class EmailListHtmlRequestDtoFactory extends JsonSchemaFactory<EmailListHtmlRequestDto> {
  const EmailListHtmlRequestDtoFactory();

  @override
  EmailListHtmlRequestDto fromJson(dynamic json) => EmailListHtmlRequestDto.fromJson(json as Map<String, dynamic>);
}




