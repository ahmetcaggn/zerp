//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockResourceCreateDTO extends Schema {
  /// Returns a new [StockResourceCreateDTO] instance.
  StockResourceCreateDTO({
    this.name,
    this.shopId,
    this.tenantId,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? name;

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
  final String? tenantId;

  /// The factory instance for creating [StockResourceCreateDTO] from JSON.
  static const factory = StockResourceCreateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockResourceCreateDTO &&
    other.name == name &&
    other.shopId == shopId &&
    other.tenantId == tenantId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (shopId == null ? 0 : shopId!.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode);

  @override
  String toString() => 'StockResourceCreateDTO[name=$name, shopId=$shopId, tenantId=$tenantId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.shopId != null) {
      json[r'shopId'] = this.shopId;
    } else {
      json[r'shopId'] = null;
    }
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    return json;
  }

  /// Returns a new [StockResourceCreateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockResourceCreateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockResourceCreateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockResourceCreateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockResourceCreateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        shopId: json[r'shopId'] is String ? json[r'shopId'] as String : null,
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
      );
    }
    return null;
  }

  static List<StockResourceCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceCreateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockResourceCreateDTO> mapFromJson(dynamic json) {
    final map = <String, StockResourceCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockResourceCreateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockResourceCreateDTO-objects as value to a dart map
  static Map<String, List<StockResourceCreateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockResourceCreateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockResourceCreateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockResourceCreateDTO] instances from JSON data.
class StockResourceCreateDTOFactory extends JsonSchemaFactory<StockResourceCreateDTO> {
  const StockResourceCreateDTOFactory();

  @override
  StockResourceCreateDTO fromJson(dynamic json) => StockResourceCreateDTO.fromJson(json)!;
}

