//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'product_extra_option_item_create_dto.dart';

class ProductExtraOptionUpdateDTO extends Schema {
  /// Returns a new [ProductExtraOptionUpdateDTO] instance.
  ProductExtraOptionUpdateDTO({
    this.name,
    this.description,
    this.price,
    this.isActive,
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
  final String? description;

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
  final bool? isActive;

  final List<ProductExtraOptionItemCreateDTO> items;

  /// The factory instance for creating [ProductExtraOptionUpdateDTO] from JSON.
  static const factory = ProductExtraOptionUpdateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductExtraOptionUpdateDTO &&
    other.name == name &&
    other.description == description &&
    other.price == price &&
    other.isActive == isActive &&
    other.items == items;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (price == null ? 0 : price!.hashCode) +
    (isActive == null ? 0 : isActive!.hashCode) +
    (items.hashCode);

  @override
  String toString() => 'ProductExtraOptionUpdateDTO[name=$name, description=$description, price=$price, isActive=$isActive, items=$items]';

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
    if (this.price != null) {
      json[r'price'] = this.price;
    } else {
      json[r'price'] = null;
    }
    if (this.isActive != null) {
      json[r'isActive'] = this.isActive;
    } else {
      json[r'isActive'] = null;
    }
      json[r'items'] = this.items;
    return json;
  }

  /// Returns a new [ProductExtraOptionUpdateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductExtraOptionUpdateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductExtraOptionUpdateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductExtraOptionUpdateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductExtraOptionUpdateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        price: num.parse('${json[r'price']}'),
        isActive: json[r'isActive'] is bool ? json[r'isActive'] as bool : null,
        items: ProductExtraOptionItemCreateDTO.listFromJson(json[r'items']),
      );
    }
    return null;
  }

  static List<ProductExtraOptionUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionUpdateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionUpdateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductExtraOptionUpdateDTO-objects as value to a dart map
  static Map<String, List<ProductExtraOptionUpdateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductExtraOptionUpdateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductExtraOptionUpdateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductExtraOptionUpdateDTO] instances from JSON data.
class ProductExtraOptionUpdateDTOFactory extends JsonSchemaFactory<ProductExtraOptionUpdateDTO> {
  const ProductExtraOptionUpdateDTOFactory();

  @override
  ProductExtraOptionUpdateDTO fromJson(dynamic json) => ProductExtraOptionUpdateDTO.fromJson(json)!;
}

