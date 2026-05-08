//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'product_extra_option_item_dto.dart';

class ProductExtraOptionDTO extends Schema {
  /// Returns a new [ProductExtraOptionDTO] instance.
  ProductExtraOptionDTO({
    this.id,
    this.productId,
    this.productName,
    this.name,
    this.description,
    this.price,
    this.items = const [],
    this.tenantId,
    this.active,
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

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? price;

  final List<ProductExtraOptionItemDTO> items;

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
  final bool? active;

  /// The factory instance for creating [ProductExtraOptionDTO] from JSON.
  static const factory = ProductExtraOptionDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductExtraOptionDTO &&
    other.id == id &&
    other.productId == productId &&
    other.productName == productName &&
    other.name == name &&
    other.description == description &&
    other.price == price &&
    other.items == items &&
    other.tenantId == tenantId &&
    other.active == active;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (productId == null ? 0 : productId!.hashCode) +
    (productName == null ? 0 : productName!.hashCode) +
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (price == null ? 0 : price!.hashCode) +
    (items.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode) +
    (active == null ? 0 : active!.hashCode);

  @override
  String toString() => 'ProductExtraOptionDTO[id=$id, productId=$productId, productName=$productName, name=$name, description=$description, price=$price, items=$items, tenantId=$tenantId, active=$active]';

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
    if (this.price != null) {
      json[r'price'] = this.price;
    } else {
      json[r'price'] = null;
    }
      json[r'items'] = this.items;
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    if (this.active != null) {
      json[r'active'] = this.active;
    } else {
      json[r'active'] = null;
    }
    return json;
  }

  /// Returns a new [ProductExtraOptionDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductExtraOptionDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductExtraOptionDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductExtraOptionDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductExtraOptionDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        productId: json[r'productId'] is String ? json[r'productId'] as String : null,
        productName: json[r'productName'] is String ? json[r'productName'] as String : null,
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        price: num.parse('${json[r'price']}'),
        items: ProductExtraOptionItemDTO.listFromJson(json[r'items']),
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
        active: json[r'active'] is bool ? json[r'active'] as bool : null,
      );
    }
    return null;
  }

  static List<ProductExtraOptionDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductExtraOptionDTO-objects as value to a dart map
  static Map<String, List<ProductExtraOptionDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductExtraOptionDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductExtraOptionDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductExtraOptionDTO] instances from JSON data.
class ProductExtraOptionDTOFactory extends JsonSchemaFactory<ProductExtraOptionDTO> {
  const ProductExtraOptionDTOFactory();

  @override
  ProductExtraOptionDTO fromJson(dynamic json) => ProductExtraOptionDTO.fromJson(json)!;
}

