//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockResourceUpdateDTO extends Schema {
  /// Returns a new [StockResourceUpdateDTO] instance.
  StockResourceUpdateDTO({
    this.name,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? name;

  /// The factory instance for creating [StockResourceUpdateDTO] from JSON.
  static const factory = StockResourceUpdateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockResourceUpdateDTO &&
    other.name == name;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode);

  @override
  String toString() => 'StockResourceUpdateDTO[name=$name]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    return json;
  }

  /// Returns a new [StockResourceUpdateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockResourceUpdateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockResourceUpdateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockResourceUpdateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockResourceUpdateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
      );
    }
    return null;
  }

  static List<StockResourceUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceUpdateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockResourceUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, StockResourceUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockResourceUpdateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockResourceUpdateDTO-objects as value to a dart map
  static Map<String, List<StockResourceUpdateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockResourceUpdateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockResourceUpdateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockResourceUpdateDTO] instances from JSON data.
class StockResourceUpdateDTOFactory extends JsonSchemaFactory<StockResourceUpdateDTO> {
  const StockResourceUpdateDTOFactory();

  @override
  StockResourceUpdateDTO fromJson(dynamic json) => StockResourceUpdateDTO.fromJson(json)!;
}

