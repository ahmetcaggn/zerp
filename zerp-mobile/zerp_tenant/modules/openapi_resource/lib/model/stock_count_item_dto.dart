//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockCountItemDTO extends Schema {
  /// Returns a new [StockCountItemDTO] instance.
  StockCountItemDTO({
    this.id,
    this.stockResourceId,
    this.stockResourceName,
    this.unitTypeAbbreviation,
    this.theoreticalQuantity,
    this.actualQuantity,
    this.discrepancy,
    this.wasteQuantity,
    this.notes,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? id;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? stockResourceId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? stockResourceName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? unitTypeAbbreviation;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? theoreticalQuantity;

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
  final num? discrepancy;

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

  /// The factory instance for creating [StockCountItemDTO] from JSON.
  static const factory = StockCountItemDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockCountItemDTO &&
    other.id == id &&
    other.stockResourceId == stockResourceId &&
    other.stockResourceName == stockResourceName &&
    other.unitTypeAbbreviation == unitTypeAbbreviation &&
    other.theoreticalQuantity == theoreticalQuantity &&
    other.actualQuantity == actualQuantity &&
    other.discrepancy == discrepancy &&
    other.wasteQuantity == wasteQuantity &&
    other.notes == notes;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (stockResourceId == null ? 0 : stockResourceId!.hashCode) +
    (stockResourceName == null ? 0 : stockResourceName!.hashCode) +
    (unitTypeAbbreviation == null ? 0 : unitTypeAbbreviation!.hashCode) +
    (theoreticalQuantity == null ? 0 : theoreticalQuantity!.hashCode) +
    (actualQuantity == null ? 0 : actualQuantity!.hashCode) +
    (discrepancy == null ? 0 : discrepancy!.hashCode) +
    (wasteQuantity == null ? 0 : wasteQuantity!.hashCode) +
    (notes == null ? 0 : notes!.hashCode);

  @override
  String toString() => 'StockCountItemDTO[id=$id, stockResourceId=$stockResourceId, stockResourceName=$stockResourceName, unitTypeAbbreviation=$unitTypeAbbreviation, theoreticalQuantity=$theoreticalQuantity, actualQuantity=$actualQuantity, discrepancy=$discrepancy, wasteQuantity=$wasteQuantity, notes=$notes]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.stockResourceId != null) {
      json[r'stockResourceId'] = this.stockResourceId;
    } else {
      json[r'stockResourceId'] = null;
    }
    if (this.stockResourceName != null) {
      json[r'stockResourceName'] = this.stockResourceName;
    } else {
      json[r'stockResourceName'] = null;
    }
    if (this.unitTypeAbbreviation != null) {
      json[r'unitTypeAbbreviation'] = this.unitTypeAbbreviation;
    } else {
      json[r'unitTypeAbbreviation'] = null;
    }
    if (this.theoreticalQuantity != null) {
      json[r'theoreticalQuantity'] = this.theoreticalQuantity;
    } else {
      json[r'theoreticalQuantity'] = null;
    }
    if (this.actualQuantity != null) {
      json[r'actualQuantity'] = this.actualQuantity;
    } else {
      json[r'actualQuantity'] = null;
    }
    if (this.discrepancy != null) {
      json[r'discrepancy'] = this.discrepancy;
    } else {
      json[r'discrepancy'] = null;
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

  /// Returns a new [StockCountItemDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockCountItemDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockCountItemDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockCountItemDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockCountItemDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        stockResourceId: json[r'stockResourceId'] is String ? json[r'stockResourceId'] as String : null,
        stockResourceName: json[r'stockResourceName'] is String ? json[r'stockResourceName'] as String : null,
        unitTypeAbbreviation: json[r'unitTypeAbbreviation'] is String ? json[r'unitTypeAbbreviation'] as String : null,
        theoreticalQuantity: num.parse('${json[r'theoreticalQuantity']}'),
        actualQuantity: num.parse('${json[r'actualQuantity']}'),
        discrepancy: num.parse('${json[r'discrepancy']}'),
        wasteQuantity: num.parse('${json[r'wasteQuantity']}'),
        notes: json[r'notes'] is String ? json[r'notes'] as String : null,
      );
    }
    return null;
  }

  static List<StockCountItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountItemDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountItemDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountItemDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockCountItemDTO-objects as value to a dart map
  static Map<String, List<StockCountItemDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockCountItemDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockCountItemDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockCountItemDTO] instances from JSON data.
class StockCountItemDTOFactory extends JsonSchemaFactory<StockCountItemDTO> {
  const StockCountItemDTOFactory();

  @override
  StockCountItemDTO fromJson(dynamic json) => StockCountItemDTO.fromJson(json)!;
}

