//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'email_list_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class EmailListRequestDto extends Schema {
  /// Returns a new [EmailListRequestDto] instance.
  EmailListRequestDto({
    this.toList = const [],
    this.subject,
    this.body,
  });

  @JsonKey(name: r'toList')
  final List<String> toList;

  @JsonKey(name: r'subject')
  final String? subject;

  @JsonKey(name: r'body')
  final String? body;

  /// The factory instance for creating [EmailListRequestDto] from JSON.
  static const factory = EmailListRequestDtoFactory();

  factory EmailListRequestDto.fromJson(Map<String, dynamic> json) => _$EmailListRequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$EmailListRequestDtoToJson(this);

  static List<EmailListRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmailListRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmailListRequestDto.fromJson(row as Map<String, dynamic>);
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
        final value = EmailListRequestDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class EmailListRequestDtoFactory extends JsonSchemaFactory<EmailListRequestDto> {
  const EmailListRequestDtoFactory();

  @override
  EmailListRequestDto fromJson(dynamic json) => EmailListRequestDto.fromJson(json as Map<String, dynamic>);
}




