//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'product_extra_option_item_create_dto.dart';

class ProductExtraOptionCreateDTO extends Schema {
  /// Returns a new [ProductExtraOptionCreateDTO] instance.
  ProductExtraOptionCreateDTO({
    this.productId,
    this.name,
    this.description,
    this.price,
    this.items = const [],
    this.active,
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

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? price;

  final List<ProductExtraOptionItemCreateDTO> items;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? active;

  /// The factory instance for creating [ProductExtraOptionCreateDTO] from JSON.
  static const factory = ProductExtraOptionCreateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductExtraOptionCreateDTO &&
    other.productId == productId &&
    other.name == name &&
    other.description == description &&
    other.price == price &&
    other.items == items &&
    other.active == active;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (productId == null ? 0 : productId!.hashCode) +
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (price == null ? 0 : price!.hashCode) +
    (items.hashCode) +
    (active == null ? 0 : active!.hashCode);

  @override
  String toString() => 'ProductExtraOptionCreateDTO[productId=$productId, name=$name, description=$description, price=$price, items=$items, active=$active]';

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
    if (this.price != null) {
      json[r'price'] = this.price;
    } else {
      json[r'price'] = null;
    }
      json[r'items'] = this.items;
    if (this.active != null) {
      json[r'active'] = this.active;
    } else {
      json[r'active'] = null;
    }
    return json;
  }

  /// Returns a new [ProductExtraOptionCreateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductExtraOptionCreateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductExtraOptionCreateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductExtraOptionCreateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductExtraOptionCreateDTO(
        productId: json[r'productId'] is String ? json[r'productId'] as String : null,
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        price: num.parse('${json[r'price']}'),
        items: ProductExtraOptionItemCreateDTO.listFromJson(json[r'items']),
        active: json[r'active'] is bool ? json[r'active'] as bool : null,
      );
    }
    return null;
  }

  static List<ProductExtraOptionCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionCreateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionCreateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductExtraOptionCreateDTO-objects as value to a dart map
  static Map<String, List<ProductExtraOptionCreateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductExtraOptionCreateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductExtraOptionCreateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductExtraOptionCreateDTO] instances from JSON data.
class ProductExtraOptionCreateDTOFactory extends JsonSchemaFactory<ProductExtraOptionCreateDTO> {
  const ProductExtraOptionCreateDTOFactory();

  @override
  ProductExtraOptionCreateDTO fromJson(dynamic json) => ProductExtraOptionCreateDTO.fromJson(json)!;
}

