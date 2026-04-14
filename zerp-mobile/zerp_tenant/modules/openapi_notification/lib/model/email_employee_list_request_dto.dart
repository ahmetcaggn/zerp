//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

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

  final Set<String> emailToList;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? serviceName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? errorCode;

  final EmailEmployeeListRequestDtoErrorTypeEnum? errorType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? errorMessage;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? exceptionStackTrace;

  /// The factory instance for creating [EmailEmployeeListRequestDto] from JSON.
  static const factory = EmailEmployeeListRequestDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is EmailEmployeeListRequestDto &&
    other.emailToList == emailToList &&
    other.serviceName == serviceName &&
    other.errorCode == errorCode &&
    other.errorType == errorType &&
    other.errorMessage == errorMessage &&
    other.exceptionStackTrace == exceptionStackTrace;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (emailToList.hashCode) +
    (serviceName == null ? 0 : serviceName!.hashCode) +
    (errorCode == null ? 0 : errorCode!.hashCode) +
    (errorType == null ? 0 : errorType!.hashCode) +
    (errorMessage == null ? 0 : errorMessage!.hashCode) +
    (exceptionStackTrace == null ? 0 : exceptionStackTrace!.hashCode);

  @override
  String toString() => 'EmailEmployeeListRequestDto[emailToList=$emailToList, serviceName=$serviceName, errorCode=$errorCode, errorType=$errorType, errorMessage=$errorMessage, exceptionStackTrace=$exceptionStackTrace]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'emailToList'] = this.emailToList.toList(growable: false);
    if (this.serviceName != null) {
      json[r'serviceName'] = this.serviceName;
    } else {
      json[r'serviceName'] = null;
    }
    if (this.errorCode != null) {
      json[r'errorCode'] = this.errorCode;
    } else {
      json[r'errorCode'] = null;
    }
    if (this.errorType != null) {
      json[r'errorType'] = this.errorType;
    } else {
      json[r'errorType'] = null;
    }
    if (this.errorMessage != null) {
      json[r'errorMessage'] = this.errorMessage;
    } else {
      json[r'errorMessage'] = null;
    }
    if (this.exceptionStackTrace != null) {
      json[r'exceptionStackTrace'] = this.exceptionStackTrace;
    } else {
      json[r'exceptionStackTrace'] = null;
    }
    return json;
  }

  /// Returns a new [EmailEmployeeListRequestDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static EmailEmployeeListRequestDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "EmailEmployeeListRequestDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "EmailEmployeeListRequestDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return EmailEmployeeListRequestDto(
        emailToList: json[r'emailToList'] is Iterable
            ? (json[r'emailToList'] as Iterable).cast<String>().toSet()
            : const {},
        serviceName: json[r'serviceName'] is String ? json[r'serviceName'] as String : null,
        errorCode: json[r'errorCode'] is String ? json[r'errorCode'] as String : null,
        errorType: EmailEmployeeListRequestDtoErrorTypeEnum.fromJson(json[r'errorType']),
        errorMessage: json[r'errorMessage'] is String ? json[r'errorMessage'] as String : null,
        exceptionStackTrace: json[r'exceptionStackTrace'] is String ? json[r'exceptionStackTrace'] as String : null,
      );
    }
    return null;
  }

  static List<EmailEmployeeListRequestDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmailEmployeeListRequestDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmailEmployeeListRequestDto.fromJson(row);
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
        final value = EmailEmployeeListRequestDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of EmailEmployeeListRequestDto-objects as value to a dart map
  static Map<String, List<EmailEmployeeListRequestDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<EmailEmployeeListRequestDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = EmailEmployeeListRequestDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [EmailEmployeeListRequestDto] instances from JSON data.
class EmailEmployeeListRequestDtoFactory extends JsonSchemaFactory<EmailEmployeeListRequestDto> {
  const EmailEmployeeListRequestDtoFactory();

  @override
  EmailEmployeeListRequestDto fromJson(dynamic json) => EmailEmployeeListRequestDto.fromJson(json)!;
}


class EmailEmployeeListRequestDtoErrorTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const EmailEmployeeListRequestDtoErrorTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const FATAL = EmailEmployeeListRequestDtoErrorTypeEnum._(r'FATAL');
  static const ERROR = EmailEmployeeListRequestDtoErrorTypeEnum._(r'ERROR');
  static const WARNING = EmailEmployeeListRequestDtoErrorTypeEnum._(r'WARNING');

  /// List of all possible values in this [enum][EmailEmployeeListRequestDtoErrorTypeEnum].
  static const values = <EmailEmployeeListRequestDtoErrorTypeEnum>[
    FATAL,
    ERROR,
    WARNING,
  ];

  static EmailEmployeeListRequestDtoErrorTypeEnum? fromJson(dynamic value) => EmailEmployeeListRequestDtoErrorTypeEnumTypeTransformer().decode(value);

  static List<EmailEmployeeListRequestDtoErrorTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <EmailEmployeeListRequestDtoErrorTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EmailEmployeeListRequestDtoErrorTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [EmailEmployeeListRequestDtoErrorTypeEnum] to String,
/// and [decode] dynamic data back to [EmailEmployeeListRequestDtoErrorTypeEnum].
class EmailEmployeeListRequestDtoErrorTypeEnumTypeTransformer {
  factory EmailEmployeeListRequestDtoErrorTypeEnumTypeTransformer() => _instance ??= const EmailEmployeeListRequestDtoErrorTypeEnumTypeTransformer._();

  const EmailEmployeeListRequestDtoErrorTypeEnumTypeTransformer._();

  String encode(EmailEmployeeListRequestDtoErrorTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a EmailEmployeeListRequestDtoErrorTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  EmailEmployeeListRequestDtoErrorTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'FATAL': return EmailEmployeeListRequestDtoErrorTypeEnum.FATAL;
        case r'ERROR': return EmailEmployeeListRequestDtoErrorTypeEnum.ERROR;
        case r'WARNING': return EmailEmployeeListRequestDtoErrorTypeEnum.WARNING;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [EmailEmployeeListRequestDtoErrorTypeEnumTypeTransformer] instance.
  static EmailEmployeeListRequestDtoErrorTypeEnumTypeTransformer? _instance;
}


