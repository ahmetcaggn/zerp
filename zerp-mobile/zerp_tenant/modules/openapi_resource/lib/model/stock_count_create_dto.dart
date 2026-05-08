//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockCountCreateDTO extends Schema {
  /// Returns a new [StockCountCreateDTO] instance.
  StockCountCreateDTO({
    this.shopId,
    this.countDate,
    this.notes,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? shopId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? countDate;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? notes;

  /// The factory instance for creating [StockCountCreateDTO] from JSON.
  static const factory = StockCountCreateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockCountCreateDTO &&
    other.shopId == shopId &&
    other.countDate == countDate &&
    other.notes == notes;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (shopId == null ? 0 : shopId!.hashCode) +
    (countDate == null ? 0 : countDate!.hashCode) +
    (notes == null ? 0 : notes!.hashCode);

  @override
  String toString() => 'StockCountCreateDTO[shopId=$shopId, countDate=$countDate, notes=$notes]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.shopId != null) {
      json[r'shopId'] = this.shopId;
    } else {
      json[r'shopId'] = null;
    }
    if (this.countDate != null) {
      json[r'countDate'] = this.countDate!.toUtc().toIso8601String();
    } else {
      json[r'countDate'] = null;
    }
    if (this.notes != null) {
      json[r'notes'] = this.notes;
    } else {
      json[r'notes'] = null;
    }
    return json;
  }

  /// Returns a new [StockCountCreateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockCountCreateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockCountCreateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockCountCreateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockCountCreateDTO(
        shopId: json[r'shopId'] is String ? json[r'shopId'] as String : null,
        countDate: json[r'countDate'] != null ? DateTime.parse(json[r'countDate'].toString()) : null,
        notes: json[r'notes'] is String ? json[r'notes'] as String : null,
      );
    }
    return null;
  }

  static List<StockCountCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountCreateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountCreateDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountCreateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockCountCreateDTO-objects as value to a dart map
  static Map<String, List<StockCountCreateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockCountCreateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockCountCreateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockCountCreateDTO] instances from JSON data.
class StockCountCreateDTOFactory extends JsonSchemaFactory<StockCountCreateDTO> {
  const StockCountCreateDTOFactory();

  @override
  StockCountCreateDTO fromJson(dynamic json) => StockCountCreateDTO.fromJson(json)!;
}

