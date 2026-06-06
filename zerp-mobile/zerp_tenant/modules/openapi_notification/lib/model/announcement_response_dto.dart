//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'announcement_recipient_response_dto.dart';


part 'announcement_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AnnouncementResponseDto extends Schema {
  /// Returns a new [AnnouncementResponseDto] instance.
  AnnouncementResponseDto({
    this.id,
    this.title,
    this.content,
    this.recipientMode,
    this.recipients = const [],
    this.recipientCount,
    this.senderId,
    this.sender,
    this.createdBy,
    this.createdAt,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'title')
  final String? title;

  @JsonKey(name: r'content')
  final String? content;

  @JsonKey(name: r'recipientMode')
  final AnnouncementResponseDtoRecipientModeEnum? recipientMode;

  @JsonKey(name: r'recipients')
  final List<AnnouncementRecipientResponseDto> recipients;

  @JsonKey(name: r'recipientCount')
  final int? recipientCount;

  @JsonKey(name: r'senderId')
  final String? senderId;

  @JsonKey(name: r'sender')
  final String? sender;

  @JsonKey(name: r'createdBy')
  final String? createdBy;

  @JsonKey(name: r'createdAt')
  final DateTime? createdAt;

  /// The factory instance for creating [AnnouncementResponseDto] from JSON.
  static const factory = AnnouncementResponseDtoFactory();

  factory AnnouncementResponseDto.fromJson(Map<String, dynamic> json) => _$AnnouncementResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$AnnouncementResponseDtoToJson(this);

  static List<AnnouncementResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AnnouncementResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AnnouncementResponseDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AnnouncementResponseDto> mapFromJson(dynamic json) {
    final map = <String, AnnouncementResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AnnouncementResponseDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AnnouncementResponseDtoFactory extends JsonSchemaFactory<AnnouncementResponseDto> {
  const AnnouncementResponseDtoFactory();

  @override
  AnnouncementResponseDto fromJson(dynamic json) => AnnouncementResponseDto.fromJson(json as Map<String, dynamic>);
}



enum AnnouncementResponseDtoRecipientModeEnum {
@JsonValue('all')
all('all'),
@JsonValue('employees')
employees('employees');

const AnnouncementResponseDtoRecipientModeEnum(this.value);

final String value;

@override
String toString() => value;
}




