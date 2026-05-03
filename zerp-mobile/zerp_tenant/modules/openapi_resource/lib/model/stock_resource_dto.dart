//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockResourceDTO extends Schema {
  /// Returns a new [StockResourceDTO] instance.
  StockResourceDTO({
    this.id,
    this.shopId,
    this.name,
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
  final String? shopId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? name;

  /// The factory instance for creating [StockResourceDTO] from JSON.
  static const factory = StockResourceDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockResourceDTO &&
    other.id == id &&
    other.shopId == shopId &&
    other.name == name;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (shopId == null ? 0 : shopId!.hashCode) +
    (name == null ? 0 : name!.hashCode);

  @override
  String toString() => 'StockResourceDTO[id=$id, shopId=$shopId, name=$name]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.shopId != null) {
      json[r'shopId'] = this.shopId;
    } else {
      json[r'shopId'] = null;
    }
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    return json;
  }

  /// Returns a new [StockResourceDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockResourceDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockResourceDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockResourceDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockResourceDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        shopId: json[r'shopId'] is String ? json[r'shopId'] as String : null,
        name: json[r'name'] is String ? json[r'name'] as String : null,
      );
    }
    return null;
  }

  static List<StockResourceDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockResourceDTO> mapFromJson(dynamic json) {
    final map = <String, StockResourceDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockResourceDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockResourceDTO-objects as value to a dart map
  static Map<String, List<StockResourceDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockResourceDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockResourceDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockResourceDTO] instances from JSON data.
class StockResourceDTOFactory extends JsonSchemaFactory<StockResourceDTO> {
  const StockResourceDTOFactory();

  @override
  StockResourceDTO fromJson(dynamic json) => StockResourceDTO.fromJson(json)!;
}

