//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockCountItemUpdateDTO extends Schema {
  /// Returns a new [StockCountItemUpdateDTO] instance.
  StockCountItemUpdateDTO({
    this.stockCountItemId,
    this.actualQuantity,
    this.wasteQuantity,
    this.notes,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? stockCountItemId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? actualQuantity;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? wasteQuantity;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? notes;

  /// The factory instance for creating [StockCountItemUpdateDTO] from JSON.
  static const factory = StockCountItemUpdateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockCountItemUpdateDTO &&
    other.stockCountItemId == stockCountItemId &&
    other.actualQuantity == actualQuantity &&
    other.wasteQuantity == wasteQuantity &&
    other.notes == notes;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (stockCountItemId == null ? 0 : stockCountItemId!.hashCode) +
    (actualQuantity == null ? 0 : actualQuantity!.hashCode) +
    (wasteQuantity == null ? 0 : wasteQuantity!.hashCode) +
    (notes == null ? 0 : notes!.hashCode);

  @override
  String toString() => 'StockCountItemUpdateDTO[stockCountItemId=$stockCountItemId, actualQuantity=$actualQuantity, wasteQuantity=$wasteQuantity, notes=$notes]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.stockCountItemId != null) {
      json[r'stockCountItemId'] = this.stockCountItemId;
    } else {
      json[r'stockCountItemId'] = null;
    }
    if (this.actualQuantity != null) {
      json[r'actualQuantity'] = this.actualQuantity;
    } else {
      json[r'actualQuantity'] = null;
    }
    if (this.wasteQuantity != null) {
      json[r'wasteQuantity'] = this.wasteQuantity;
    } else {
      json[r'wasteQuantity'] = null;
    }
    if (this.notes != null) {
      json[r'notes'] = this.notes;
    } else {
      json[r'notes'] = null;
    }
    return json;
  }

  /// Returns a new [StockCountItemUpdateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockCountItemUpdateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockCountItemUpdateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockCountItemUpdateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockCountItemUpdateDTO(
        stockCountItemId: json[r'stockCountItemId'] is String ? json[r'stockCountItemId'] as String : null,
        actualQuantity: num.parse('${json[r'actualQuantity']}'),
        wasteQuantity: num.parse('${json[r'wasteQuantity']}'),
        notes: json[r'notes'] is String ? json[r'notes'] as String : null,
      );
    }
    return null;
  }

  static List<StockCountItemUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountItemUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountItemUpdateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountItemUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountItemUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountItemUpdateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockCountItemUpdateDTO-objects as value to a dart map
  static Map<String, List<StockCountItemUpdateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockCountItemUpdateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockCountItemUpdateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockCountItemUpdateDTO] instances from JSON data.
class StockCountItemUpdateDTOFactory extends JsonSchemaFactory<StockCountItemUpdateDTO> {
  const StockCountItemUpdateDTOFactory();

  @override
  StockCountItemUpdateDTO fromJson(dynamic json) => StockCountItemUpdateDTO.fromJson(json)!;
}

