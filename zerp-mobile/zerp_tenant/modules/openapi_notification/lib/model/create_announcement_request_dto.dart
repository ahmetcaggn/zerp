//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'create_announcement_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateAnnouncementRequestDto extends Schema {
  /// Returns a new [CreateAnnouncementRequestDto] instance.
  CreateAnnouncementRequestDto({
    required this.title,
    required this.content,
    required this.recipientMode,
    this.employeeIds = const [],
  });

  @JsonKey(name: r'title')
  final String title;

  @JsonKey(name: r'content')
  final String content;

  @JsonKey(name: r'recipientMode')
  final CreateAnnouncementRequestDtoRecipientModeEnum recipientMode;

  @JsonKey(name: r'employeeIds')
  final List<String> employeeIds;

  /// The factory instance for creating [CreateAnnouncementRequestDto] from JSON.
  static const factory = CreateAnnouncementRequestDtoFactory();

  factory CreateAnnouncementRequestDto.fromJson(Map<String, dynamic> json) => _$CreateAnnouncementRequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$CreateAnnouncementRequestDtoToJson(this);

  static List<CreateAnnouncementRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateAnnouncementRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateAnnouncementRequestDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreateAnnouncementRequestDto> mapFromJson(dynamic json) {
    final map = <String, CreateAnnouncementRequestDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreateAnnouncementRequestDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class CreateAnnouncementRequestDtoFactory extends JsonSchemaFactory<CreateAnnouncementRequestDto> {
  const CreateAnnouncementRequestDtoFactory();

  @override
  CreateAnnouncementRequestDto fromJson(dynamic json) => CreateAnnouncementRequestDto.fromJson(json as Map<String, dynamic>);
}



enum CreateAnnouncementRequestDtoRecipientModeEnum {
@JsonValue('all')
all('all'),
@JsonValue('employees')
employees('employees');

const CreateAnnouncementRequestDtoRecipientModeEnum(this.value);

final String value;

@override
String toString() => value;
}




