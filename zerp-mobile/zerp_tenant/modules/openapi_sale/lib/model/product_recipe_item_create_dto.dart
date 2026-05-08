//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class ProductRecipeItemCreateDTO extends Schema {
  /// Returns a new [ProductRecipeItemCreateDTO] instance.
  ProductRecipeItemCreateDTO({
    this.stockResourceId,
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
  final String? stockResourceId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? quantity;

  final ProductRecipeItemCreateDTOUnitTypeEnum? unitType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? notes;

  /// The factory instance for creating [ProductRecipeItemCreateDTO] from JSON.
  static const factory = ProductRecipeItemCreateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductRecipeItemCreateDTO &&
    other.stockResourceId == stockResourceId &&
    other.quantity == quantity &&
    other.unitType == unitType &&
    other.notes == notes;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (stockResourceId == null ? 0 : stockResourceId!.hashCode) +
    (quantity == null ? 0 : quantity!.hashCode) +
    (unitType == null ? 0 : unitType!.hashCode) +
    (notes == null ? 0 : notes!.hashCode);

  @override
  String toString() => 'ProductRecipeItemCreateDTO[stockResourceId=$stockResourceId, quantity=$quantity, unitType=$unitType, notes=$notes]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.stockResourceId != null) {
      json[r'stockResourceId'] = this.stockResourceId;
    } else {
      json[r'stockResourceId'] = null;
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

  /// Returns a new [ProductRecipeItemCreateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductRecipeItemCreateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductRecipeItemCreateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductRecipeItemCreateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductRecipeItemCreateDTO(
        stockResourceId: json[r'stockResourceId'] is String ? json[r'stockResourceId'] as String : null,
        quantity: num.parse('${json[r'quantity']}'),
        unitType: ProductRecipeItemCreateDTOUnitTypeEnum.fromJson(json[r'unitType']),
        notes: json[r'notes'] is String ? json[r'notes'] as String : null,
      );
    }
    return null;
  }

  static List<ProductRecipeItemCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeItemCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeItemCreateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductRecipeItemCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductRecipeItemCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductRecipeItemCreateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductRecipeItemCreateDTO-objects as value to a dart map
  static Map<String, List<ProductRecipeItemCreateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductRecipeItemCreateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductRecipeItemCreateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductRecipeItemCreateDTO] instances from JSON data.
class ProductRecipeItemCreateDTOFactory extends JsonSchemaFactory<ProductRecipeItemCreateDTO> {
  const ProductRecipeItemCreateDTOFactory();

  @override
  ProductRecipeItemCreateDTO fromJson(dynamic json) => ProductRecipeItemCreateDTO.fromJson(json)!;
}


class ProductRecipeItemCreateDTOUnitTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const ProductRecipeItemCreateDTOUnitTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PIECE = ProductRecipeItemCreateDTOUnitTypeEnum._(r'PIECE');
  static const GRAM = ProductRecipeItemCreateDTOUnitTypeEnum._(r'GRAM');
  static const KILOGRAM = ProductRecipeItemCreateDTOUnitTypeEnum._(r'KILOGRAM');
  static const MILLILITER = ProductRecipeItemCreateDTOUnitTypeEnum._(r'MILLILITER');
  static const LITER = ProductRecipeItemCreateDTOUnitTypeEnum._(r'LITER');

  /// List of all possible values in this [enum][ProductRecipeItemCreateDTOUnitTypeEnum].
  static const values = <ProductRecipeItemCreateDTOUnitTypeEnum>[
    PIECE,
    GRAM,
    KILOGRAM,
    MILLILITER,
    LITER,
  ];

  static ProductRecipeItemCreateDTOUnitTypeEnum? fromJson(dynamic value) => ProductRecipeItemCreateDTOUnitTypeEnumTypeTransformer().decode(value);

  static List<ProductRecipeItemCreateDTOUnitTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductRecipeItemCreateDTOUnitTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductRecipeItemCreateDTOUnitTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ProductRecipeItemCreateDTOUnitTypeEnum] to String,
/// and [decode] dynamic data back to [ProductRecipeItemCreateDTOUnitTypeEnum].
class ProductRecipeItemCreateDTOUnitTypeEnumTypeTransformer {
  factory ProductRecipeItemCreateDTOUnitTypeEnumTypeTransformer() => _instance ??= const ProductRecipeItemCreateDTOUnitTypeEnumTypeTransformer._();

  const ProductRecipeItemCreateDTOUnitTypeEnumTypeTransformer._();

  String encode(ProductRecipeItemCreateDTOUnitTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ProductRecipeItemCreateDTOUnitTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ProductRecipeItemCreateDTOUnitTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PIECE': return ProductRecipeItemCreateDTOUnitTypeEnum.PIECE;
        case r'GRAM': return ProductRecipeItemCreateDTOUnitTypeEnum.GRAM;
        case r'KILOGRAM': return ProductRecipeItemCreateDTOUnitTypeEnum.KILOGRAM;
        case r'MILLILITER': return ProductRecipeItemCreateDTOUnitTypeEnum.MILLILITER;
        case r'LITER': return ProductRecipeItemCreateDTOUnitTypeEnum.LITER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ProductRecipeItemCreateDTOUnitTypeEnumTypeTransformer] instance.
  static ProductRecipeItemCreateDTOUnitTypeEnumTypeTransformer? _instance;
}


