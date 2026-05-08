//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'menu_item_dto.dart';
import 'meta.dart';
import 'parameter.dart';

class ApiResponseMenuItemDTO extends Schema {
  /// Returns a new [ApiResponseMenuItemDTO] instance.
  ApiResponseMenuItemDTO({
    this.success,
    this.statusCode,
    this.message,
    this.data,
    this.meta,
    this.parameters = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? success;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? statusCode;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? message;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final MenuItemDTO? data;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final Meta? meta;

  final List<Parameter> parameters;

  /// The factory instance for creating [ApiResponseMenuItemDTO] from JSON.
  static const factory = ApiResponseMenuItemDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ApiResponseMenuItemDTO &&
    other.success == success &&
    other.statusCode == statusCode &&
    other.message == message &&
    other.data == data &&
    other.meta == meta &&
    other.parameters == parameters;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (success == null ? 0 : success!.hashCode) +
    (statusCode == null ? 0 : statusCode!.hashCode) +
    (message == null ? 0 : message!.hashCode) +
    (data == null ? 0 : data!.hashCode) +
    (meta == null ? 0 : meta!.hashCode) +
    (parameters.hashCode);

  @override
  String toString() => 'ApiResponseMenuItemDTO[success=$success, statusCode=$statusCode, message=$message, data=$data, meta=$meta, parameters=$parameters]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.success != null) {
      json[r'success'] = this.success;
    } else {
      json[r'success'] = null;
    }
    if (this.statusCode != null) {
      json[r'statusCode'] = this.statusCode;
    } else {
      json[r'statusCode'] = null;
    }
    if (this.message != null) {
      json[r'message'] = this.message;
    } else {
      json[r'message'] = null;
    }
    if (this.data != null) {
      json[r'data'] = this.data;
    } else {
      json[r'data'] = null;
    }
    if (this.meta != null) {
      json[r'meta'] = this.meta;
    } else {
      json[r'meta'] = null;
    }
      json[r'parameters'] = this.parameters;
    return json;
  }

  /// Returns a new [ApiResponseMenuItemDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ApiResponseMenuItemDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ApiResponseMenuItemDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ApiResponseMenuItemDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ApiResponseMenuItemDTO(
        success: json[r'success'] is bool ? json[r'success'] as bool : null,
        statusCode: json[r'statusCode'] is int ? json[r'statusCode'] as int : null,
        message: json[r'message'] is String ? json[r'message'] as String : null,
        data: MenuItemDTO.fromJson(json[r'data']),
        meta: Meta.fromJson(json[r'meta']),
        parameters: Parameter.listFromJson(json[r'parameters']),
      );
    }
    return null;
  }

  static List<ApiResponseMenuItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ApiResponseMenuItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ApiResponseMenuItemDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ApiResponseMenuItemDTO> mapFromJson(dynamic json) {
    final map = <String, ApiResponseMenuItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ApiResponseMenuItemDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ApiResponseMenuItemDTO-objects as value to a dart map
  static Map<String, List<ApiResponseMenuItemDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ApiResponseMenuItemDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ApiResponseMenuItemDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ApiResponseMenuItemDTO] instances from JSON data.
class ApiResponseMenuItemDTOFactory extends JsonSchemaFactory<ApiResponseMenuItemDTO> {
  const ApiResponseMenuItemDTOFactory();

  @override
  ApiResponseMenuItemDTO fromJson(dynamic json) => ApiResponseMenuItemDTO.fromJson(json)!;
}

