//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class ProductRecipeItemDTO extends Schema {
  /// Returns a new [ProductRecipeItemDTO] instance.
  ProductRecipeItemDTO({
    this.id,
    this.stockResourceId,
    this.stockResourceName,
    this.quantity,
    this.unitType,
    this.notes,
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
  final String? stockResourceId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? stockResourceName;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? quantity;

  final ProductRecipeItemDTOUnitTypeEnum? unitType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? notes;

  /// The factory instance for creating [ProductRecipeItemDTO] from JSON.
  static const factory = ProductRecipeItemDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductRecipeItemDTO &&
    other.id == id &&
    other.stockResourceId == stockResourceId &&
    other.stockResourceName == stockResourceName &&
    other.quantity == quantity &&
    other.unitType == unitType &&
    other.notes == notes;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (stockResourceId == null ? 0 : stockResourceId!.hashCode) +
    (stockResourceName == null ? 0 : stockResourceName!.hashCode) +
    (quantity == null ? 0 : quantity!.hashCode) +
    (unitType == null ? 0 : unitType!.hashCode) +
    (notes == null ? 0 : notes!.hashCode);

  @override
  String toString() => 'ProductRecipeItemDTO[id=$id, stockResourceId=$stockResourceId, stockResourceName=$stockResourceName, quantity=$quantity, unitType=$unitType, notes=$notes]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.stockResourceId != null) {
      json[r'stockResourceId'] = this.stockResourceId;
    } else {
      json[r'stockResourceId'] = null;
    }
    if (this.stockResourceName != null) {
      json[r'stockResourceName'] = this.stockResourceName;
    } else {
      json[r'stockResourceName'] = null;
    }
    if (this.quantity != null) {
      json[r'quantity'] = this.quantity;
    } else {
      json[r'quantity'] = null;
    }
    if (this.unitType != null) {
      json[r'unitType'] = this.unitType;
    } else {
      json[r'unitType'] = null;
    }
    if (this.notes != null) {
      json[r'notes'] = this.notes;
    } else {
      json[r'notes'] = null;
    }
    return json;
  }

  /// Returns a new [ProductRecipeItemDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductRecipeItemDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductRecipeItemDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductRecipeItemDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductRecipeItemDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        stockResourceId: json[r'stockResourceId'] is String ? json[r'stockResourceId'] as String : null,
        stockResourceName: json[r'stockResourceName'] is String ? json[r'stockResourceName'] as String : null,
        quantity: num.parse('${json[r'quantity']}'),
        unitType: ProductRecipeItemDTOUnitTypeEnum.fromJson(json[r'unitType']),
        notes: json[r'notes'] is String ? json[r'notes'] as String : null,
      );
    }
    return null;
  }

  static List<ProductRecipeItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeItemDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeItemDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeItemDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductRecipeItemDTO-objects as value to a dart map
  static Map<String, List<ProductRecipeItemDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductRecipeItemDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductRecipeItemDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductRecipeItemDTO] instances from JSON data.
class ProductRecipeItemDTOFactory extends JsonSchemaFactory<ProductRecipeItemDTO> {
  const ProductRecipeItemDTOFactory();

  @override
  ProductRecipeItemDTO fromJson(dynamic json) => ProductRecipeItemDTO.fromJson(json)!;
}


class ProductRecipeItemDTOUnitTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const ProductRecipeItemDTOUnitTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PIECE = ProductRecipeItemDTOUnitTypeEnum._(r'PIECE');
  static const GRAM = ProductRecipeItemDTOUnitTypeEnum._(r'GRAM');
  static const KILOGRAM = ProductRecipeItemDTOUnitTypeEnum._(r'KILOGRAM');
  static const MILLILITER = ProductRecipeItemDTOUnitTypeEnum._(r'MILLILITER');
  static const LITER = ProductRecipeItemDTOUnitTypeEnum._(r'LITER');

  /// List of all possible values in this [enum][ProductRecipeItemDTOUnitTypeEnum].
  static const values = <ProductRecipeItemDTOUnitTypeEnum>[
    PIECE,
    GRAM,
    KILOGRAM,
    MILLILITER,
    LITER,
  ];

  static ProductRecipeItemDTOUnitTypeEnum? fromJson(dynamic value) => ProductRecipeItemDTOUnitTypeEnumTypeTransformer().decode(value);

  static List<ProductRecipeItemDTOUnitTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeItemDTOUnitTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeItemDTOUnitTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ProductRecipeItemDTOUnitTypeEnum] to String,
/// and [decode] dynamic data back to [ProductRecipeItemDTOUnitTypeEnum].
class ProductRecipeItemDTOUnitTypeEnumTypeTransformer {
  factory ProductRecipeItemDTOUnitTypeEnumTypeTransformer() => _instance ??= const ProductRecipeItemDTOUnitTypeEnumTypeTransformer._();

  const ProductRecipeItemDTOUnitTypeEnumTypeTransformer._();

  String encode(ProductRecipeItemDTOUnitTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ProductRecipeItemDTOUnitTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ProductRecipeItemDTOUnitTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PIECE': return ProductRecipeItemDTOUnitTypeEnum.PIECE;
        case r'GRAM': return ProductRecipeItemDTOUnitTypeEnum.GRAM;
        case r'KILOGRAM': return ProductRecipeItemDTOUnitTypeEnum.KILOGRAM;
        case r'MILLILITER': return ProductRecipeItemDTOUnitTypeEnum.MILLILITER;
        case r'LITER': return ProductRecipeItemDTOUnitTypeEnum.LITER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ProductRecipeItemDTOUnitTypeEnumTypeTransformer] instance.
  static ProductRecipeItemDTOUnitTypeEnumTypeTransformer? _instance;
}


