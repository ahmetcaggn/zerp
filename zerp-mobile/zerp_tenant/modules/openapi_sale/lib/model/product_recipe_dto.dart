//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'product_recipe_item_dto.dart';

class ProductRecipeDTO extends Schema {
  /// Returns a new [ProductRecipeDTO] instance.
  ProductRecipeDTO({
    this.id,
    this.productId,
    this.productName,
    this.name,
    this.description,
    this.items = const [],
    this.tenantId,
    this.default_,
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
  final String? productId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? productName;

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

  final List<ProductRecipeItemDTO> items;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? tenantId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? default_;

  /// The factory instance for creating [ProductRecipeDTO] from JSON.
  static const factory = ProductRecipeDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductRecipeDTO &&
    other.id == id &&
    other.productId == productId &&
    other.productName == productName &&
    other.name == name &&
    other.description == description &&
    other.items == items &&
    other.tenantId == tenantId &&
    other.default_ == default_;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (productId == null ? 0 : productId!.hashCode) +
    (productName == null ? 0 : productName!.hashCode) +
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (items.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode) +
    (default_ == null ? 0 : default_!.hashCode);

  @override
  String toString() => 'ProductRecipeDTO[id=$id, productId=$productId, productName=$productName, name=$name, description=$description, items=$items, tenantId=$tenantId, default_=$default_]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.productId != null) {
      json[r'productId'] = this.productId;
    } else {
      json[r'productId'] = null;
    }
    if (this.productName != null) {
      json[r'productName'] = this.productName;
    } else {
      json[r'productName'] = null;
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
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    if (this.default_ != null) {
      json[r'default'] = this.default_;
    } else {
      json[r'default'] = null;
    }
    return json;
  }

  /// Returns a new [ProductRecipeDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductRecipeDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductRecipeDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductRecipeDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductRecipeDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        productId: json[r'productId'] is String ? json[r'productId'] as String : null,
        productName: json[r'productName'] is String ? json[r'productName'] as String : null,
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        items: ProductRecipeItemDTO.listFromJson(json[r'items']),
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
        default_: json[r'default'] is bool ? json[r'default'] as bool : null,
      );
    }
    return null;
  }

  static List<ProductRecipeDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductRecipeDTO-objects as value to a dart map
  static Map<String, List<ProductRecipeDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductRecipeDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductRecipeDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductRecipeDTO] instances from JSON data.
class ProductRecipeDTOFactory extends JsonSchemaFactory<ProductRecipeDTO> {
  const ProductRecipeDTOFactory();

  @override
  ProductRecipeDTO fromJson(dynamic json) => ProductRecipeDTO.fromJson(json)!;
}

