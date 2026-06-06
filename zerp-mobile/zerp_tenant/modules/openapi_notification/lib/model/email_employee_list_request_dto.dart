//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'email_employee_list_request_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class EmailEmployeeListRequestDto extends Schema {
  /// Returns a new [EmailEmployeeListRequestDto] instance.
  EmailEmployeeListRequestDto({
    this.emailToList = const {},
    this.serviceName,
    this.errorCode,
    this.errorType,
    this.errorMessage,
    this.exceptionStackTrace,
  });

  @JsonKey(name: r'emailToList')
  final Set<String> emailToList;

  @JsonKey(name: r'serviceName')
  final String? serviceName;

  @JsonKey(name: r'errorCode')
  final String? errorCode;

  @JsonKey(name: r'errorType')
  final EmailEmployeeListRequestDtoErrorTypeEnum? errorType;

  @JsonKey(name: r'errorMessage')
  final String? errorMessage;

  @JsonKey(name: r'exceptionStackTrace')
  final String? exceptionStackTrace;

  /// The factory instance for creating [EmailEmployeeListRequestDto] from JSON.
  static const factory = EmailEmployeeListRequestDtoFactory();

  factory EmailEmployeeListRequestDto.fromJson(Map<String, dynamic> json) => _$EmailEmployeeListRequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$EmailEmployeeListRequestDtoToJson(this);

  static List<EmailEmployeeListRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmailEmployeeListRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmailEmployeeListRequestDto.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EmailEmployeeListRequestDto> mapFromJson(dynamic json) {
    final map = <String, EmailEmployeeListRequestDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EmailEmployeeListRequestDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class EmailEmployeeListRequestDtoFactory extends JsonSchemaFactory<EmailEmployeeListRequestDto> {
  const EmailEmployeeListRequestDtoFactory();

  @override
  EmailEmployeeListRequestDto fromJson(dynamic json) => EmailEmployeeListRequestDto.fromJson(json as Map<String, dynamic>);
}



enum EmailEmployeeListRequestDtoErrorTypeEnum {
@JsonValue('FATAL')
FATAL('FATAL'),
@JsonValue('ERROR')
ERROR('ERROR'),
@JsonValue('WARNING')
WARNING('WARNING');

const EmailEmployeeListRequestDtoErrorTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




