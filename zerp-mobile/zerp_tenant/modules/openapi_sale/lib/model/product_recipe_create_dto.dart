//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'product_recipe_item_create_dto.dart';

class ProductRecipeCreateDTO extends Schema {
  /// Returns a new [ProductRecipeCreateDTO] instance.
  ProductRecipeCreateDTO({
    this.productId,
    this.name,
    this.description,
    this.items = const [],
    this.default_,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? productId;

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

  final List<ProductRecipeItemCreateDTO> items;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? default_;

  /// The factory instance for creating [ProductRecipeCreateDTO] from JSON.
  static const factory = ProductRecipeCreateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductRecipeCreateDTO &&
    other.productId == productId &&
    other.name == name &&
    other.description == description &&
    other.items == items &&
    other.default_ == default_;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (productId == null ? 0 : productId!.hashCode) +
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (items.hashCode) +
    (default_ == null ? 0 : default_!.hashCode);

  @override
  String toString() => 'ProductRecipeCreateDTO[productId=$productId, name=$name, description=$description, items=$items, default_=$default_]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.productId != null) {
      json[r'productId'] = this.productId;
    } else {
      json[r'productId'] = null;
    }
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
      json[r'items'] = this.items;
    if (this.default_ != null) {
      json[r'default'] = this.default_;
    } else {
      json[r'default'] = null;
    }
    return json;
  }

  /// Returns a new [ProductRecipeCreateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductRecipeCreateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductRecipeCreateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductRecipeCreateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductRecipeCreateDTO(
        productId: json[r'productId'] is String ? json[r'productId'] as String : null,
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        items: ProductRecipeItemCreateDTO.listFromJson(json[r'items']),
        default_: json[r'default'] is bool ? json[r'default'] as bool : null,
      );
    }
    return null;
  }

  static List<ProductRecipeCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeCreateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeCreateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductRecipeCreateDTO-objects as value to a dart map
  static Map<String, List<ProductRecipeCreateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductRecipeCreateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductRecipeCreateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductRecipeCreateDTO] instances from JSON data.
class ProductRecipeCreateDTOFactory extends JsonSchemaFactory<ProductRecipeCreateDTO> {
  const ProductRecipeCreateDTOFactory();

  @override
  ProductRecipeCreateDTO fromJson(dynamic json) => ProductRecipeCreateDTO.fromJson(json)!;
}

