//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'email_single_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class EmailSingleRequestDto extends Schema {
  /// Returns a new [EmailSingleRequestDto] instance.
  EmailSingleRequestDto({
    this.to,
    this.subject,
    this.body,
  });

  @JsonKey(name: r'to')
  final String? to;

  @JsonKey(name: r'subject')
  final String? subject;

  @JsonKey(name: r'body')
  final String? body;

  /// The factory instance for creating [EmailSingleRequestDto] from JSON.
  static const factory = EmailSingleRequestDtoFactory();

  factory EmailSingleRequestDto.fromJson(Map<String, dynamic> json) => _$EmailSingleRequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$EmailSingleRequestDtoToJson(this);

  static List<EmailSingleRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmailSingleRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmailSingleRequestDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmailSingleRequestDto> mapFromJson(dynamic json) {
    final map = <String, EmailSingleRequestDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmailSingleRequestDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class EmailSingleRequestDtoFactory extends JsonSchemaFactory<EmailSingleRequestDto> {
  const EmailSingleRequestDtoFactory();

  @override
  EmailSingleRequestDto fromJson(dynamic json) => EmailSingleRequestDto.fromJson(json as Map<String, dynamic>);
}




