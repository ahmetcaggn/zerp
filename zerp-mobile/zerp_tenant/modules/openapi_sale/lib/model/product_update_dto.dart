//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class ProductUpdateDTO extends Schema {
  /// Returns a new [ProductUpdateDTO] instance.
  ProductUpdateDTO({
    this.name,
    this.description,
    this.imageId,
    this.typeId,
    this.metricId,
    this.menuItemId,
    this.price,
    this.preparationTime,
    this.isActive,
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
  final String? description;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? imageId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? typeId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? metricId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? menuItemId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? price;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? preparationTime;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? isActive;

  /// The factory instance for creating [ProductUpdateDTO] from JSON.
  static const factory = ProductUpdateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductUpdateDTO &&
    other.name == name &&
    other.description == description &&
    other.imageId == imageId &&
    other.typeId == typeId &&
    other.metricId == metricId &&
    other.menuItemId == menuItemId &&
    other.price == price &&
    other.preparationTime == preparationTime &&
    other.isActive == isActive;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (imageId == null ? 0 : imageId!.hashCode) +
    (typeId == null ? 0 : typeId!.hashCode) +
    (metricId == null ? 0 : metricId!.hashCode) +
    (menuItemId == null ? 0 : menuItemId!.hashCode) +
    (price == null ? 0 : price!.hashCode) +
    (preparationTime == null ? 0 : preparationTime!.hashCode) +
    (isActive == null ? 0 : isActive!.hashCode);

  @override
  String toString() => 'ProductUpdateDTO[name=$name, description=$description, imageId=$imageId, typeId=$typeId, metricId=$metricId, menuItemId=$menuItemId, price=$price, preparationTime=$preparationTime, isActive=$isActive]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.imageId != null) {
      json[r'imageId'] = this.imageId;
    } else {
      json[r'imageId'] = null;
    }
    if (this.typeId != null) {
      json[r'typeId'] = this.typeId;
    } else {
      json[r'typeId'] = null;
    }
    if (this.metricId != null) {
      json[r'metricId'] = this.metricId;
    } else {
      json[r'metricId'] = null;
    }
    if (this.menuItemId != null) {
      json[r'menuItemId'] = this.menuItemId;
    } else {
      json[r'menuItemId'] = null;
    }
    if (this.price != null) {
      json[r'price'] = this.price;
    } else {
      json[r'price'] = null;
    }
    if (this.preparationTime != null) {
      json[r'preparationTime'] = this.preparationTime;
    } else {
      json[r'preparationTime'] = null;
    }
    if (this.isActive != null) {
      json[r'isActive'] = this.isActive;
    } else {
      json[r'isActive'] = null;
    }
    return json;
  }

  /// Returns a new [ProductUpdateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductUpdateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductUpdateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductUpdateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductUpdateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        imageId: json[r'imageId'] is String ? json[r'imageId'] as String : null,
        typeId: json[r'typeId'] is String ? json[r'typeId'] as String : null,
        metricId: json[r'metricId'] is String ? json[r'metricId'] as String : null,
        menuItemId: json[r'menuItemId'] is String ? json[r'menuItemId'] as String : null,
        price: num.parse('${json[r'price']}'),
        preparationTime: json[r'preparationTime'] is int ? json[r'preparationTime'] as int : null,
        isActive: json[r'isActive'] is bool ? json[r'isActive'] as bool : null,
      );
    }
    return null;
  }

  static List<ProductUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductUpdateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductUpdateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductUpdateDTO-objects as value to a dart map
  static Map<String, List<ProductUpdateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductUpdateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductUpdateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductUpdateDTO] instances from JSON data.
class ProductUpdateDTOFactory extends JsonSchemaFactory<ProductUpdateDTO> {
  const ProductUpdateDTOFactory();

  @override
  ProductUpdateDTO fromJson(dynamic json) => ProductUpdateDTO.fromJson(json)!;
}

