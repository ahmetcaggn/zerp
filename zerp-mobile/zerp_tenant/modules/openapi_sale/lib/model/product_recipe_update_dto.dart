//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'product_recipe_item_create_dto.dart';

class ProductRecipeUpdateDTO extends Schema {
  /// Returns a new [ProductRecipeUpdateDTO] instance.
  ProductRecipeUpdateDTO({
    this.name,
    this.isDefault,
    this.description,
    this.items = const [],
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
  final bool? isDefault;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? description;

  final List<ProductRecipeItemCreateDTO> items;

  /// The factory instance for creating [ProductRecipeUpdateDTO] from JSON.
  static const factory = ProductRecipeUpdateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductRecipeUpdateDTO &&
    other.name == name &&
    other.isDefault == isDefault &&
    other.description == description &&
    other.items == items;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (isDefault == null ? 0 : isDefault!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (items.hashCode);

  @override
  String toString() => 'ProductRecipeUpdateDTO[name=$name, isDefault=$isDefault, description=$description, items=$items]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.isDefault != null) {
      json[r'isDefault'] = this.isDefault;
    } else {
      json[r'isDefault'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
      json[r'items'] = this.items;
    return json;
  }

  /// Returns a new [ProductRecipeUpdateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductRecipeUpdateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductRecipeUpdateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductRecipeUpdateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductRecipeUpdateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        isDefault: json[r'isDefault'] is bool ? json[r'isDefault'] as bool : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        items: ProductRecipeItemCreateDTO.listFromJson(json[r'items']),
      );
    }
    return null;
  }

  static List<ProductRecipeUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeUpdateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeUpdateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductRecipeUpdateDTO-objects as value to a dart map
  static Map<String, List<ProductRecipeUpdateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductRecipeUpdateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductRecipeUpdateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductRecipeUpdateDTO] instances from JSON data.
class ProductRecipeUpdateDTOFactory extends JsonSchemaFactory<ProductRecipeUpdateDTO> {
  const ProductRecipeUpdateDTOFactory();

  @override
  ProductRecipeUpdateDTO fromJson(dynamic json) => ProductRecipeUpdateDTO.fromJson(json)!;
}

