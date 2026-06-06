//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'announcement_recipient_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AnnouncementRecipientResponseDto extends Schema {
  /// Returns a new [AnnouncementRecipientResponseDto] instance.
  AnnouncementRecipientResponseDto({
    this.employeeId,
    this.displayName,
    this.email,
  });

  @JsonKey(name: r'employeeId')
  final String? employeeId;

  @JsonKey(name: r'displayName')
  final String? displayName;

  @JsonKey(name: r'email')
  final String? email;

  /// The factory instance for creating [AnnouncementRecipientResponseDto] from JSON.
  static const factory = AnnouncementRecipientResponseDtoFactory();

  factory AnnouncementRecipientResponseDto.fromJson(Map<String, dynamic> json) => _$AnnouncementRecipientResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$AnnouncementRecipientResponseDtoToJson(this);

  static List<AnnouncementRecipientResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AnnouncementRecipientResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AnnouncementRecipientResponseDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AnnouncementRecipientResponseDto> mapFromJson(dynamic json) {
    final map = <String, AnnouncementRecipientResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AnnouncementRecipientResponseDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AnnouncementRecipientResponseDtoFactory extends JsonSchemaFactory<AnnouncementRecipientResponseDto> {
  const AnnouncementRecipientResponseDtoFactory();

  @override
  AnnouncementRecipientResponseDto fromJson(dynamic json) => AnnouncementRecipientResponseDto.fromJson(json as Map<String, dynamic>);
}




