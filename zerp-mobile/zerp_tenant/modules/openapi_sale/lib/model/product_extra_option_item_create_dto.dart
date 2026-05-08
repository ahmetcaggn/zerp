//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class ProductExtraOptionItemCreateDTO extends Schema {
  /// Returns a new [ProductExtraOptionItemCreateDTO] instance.
  ProductExtraOptionItemCreateDTO({
    this.stockResourceId,
    this.quantity,
    this.unitType,
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

  final ProductExtraOptionItemCreateDTOUnitTypeEnum? unitType;

  /// The factory instance for creating [ProductExtraOptionItemCreateDTO] from JSON.
  static const factory = ProductExtraOptionItemCreateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductExtraOptionItemCreateDTO &&
    other.stockResourceId == stockResourceId &&
    other.quantity == quantity &&
    other.unitType == unitType;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (stockResourceId == null ? 0 : stockResourceId!.hashCode) +
    (quantity == null ? 0 : quantity!.hashCode) +
    (unitType == null ? 0 : unitType!.hashCode);

  @override
  String toString() => 'ProductExtraOptionItemCreateDTO[stockResourceId=$stockResourceId, quantity=$quantity, unitType=$unitType]';

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
    return json;
  }

  /// Returns a new [ProductExtraOptionItemCreateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductExtraOptionItemCreateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductExtraOptionItemCreateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductExtraOptionItemCreateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductExtraOptionItemCreateDTO(
        stockResourceId: json[r'stockResourceId'] is String ? json[r'stockResourceId'] as String : null,
        quantity: num.parse('${json[r'quantity']}'),
        unitType: ProductExtraOptionItemCreateDTOUnitTypeEnum.fromJson(json[r'unitType']),
      );
    }
    return null;
  }

  static List<ProductExtraOptionItemCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionItemCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionItemCreateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionItemCreateDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionItemCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionItemCreateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductExtraOptionItemCreateDTO-objects as value to a dart map
  static Map<String, List<ProductExtraOptionItemCreateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductExtraOptionItemCreateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductExtraOptionItemCreateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductExtraOptionItemCreateDTO] instances from JSON data.
class ProductExtraOptionItemCreateDTOFactory extends JsonSchemaFactory<ProductExtraOptionItemCreateDTO> {
  const ProductExtraOptionItemCreateDTOFactory();

  @override
  ProductExtraOptionItemCreateDTO fromJson(dynamic json) => ProductExtraOptionItemCreateDTO.fromJson(json)!;
}


class ProductExtraOptionItemCreateDTOUnitTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const ProductExtraOptionItemCreateDTOUnitTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PIECE = ProductExtraOptionItemCreateDTOUnitTypeEnum._(r'PIECE');
  static const GRAM = ProductExtraOptionItemCreateDTOUnitTypeEnum._(r'GRAM');
  static const KILOGRAM = ProductExtraOptionItemCreateDTOUnitTypeEnum._(r'KILOGRAM');
  static const MILLILITER = ProductExtraOptionItemCreateDTOUnitTypeEnum._(r'MILLILITER');
  static const LITER = ProductExtraOptionItemCreateDTOUnitTypeEnum._(r'LITER');

  /// List of all possible values in this [enum][ProductExtraOptionItemCreateDTOUnitTypeEnum].
  static const values = <ProductExtraOptionItemCreateDTOUnitTypeEnum>[
    PIECE,
    GRAM,
    KILOGRAM,
    MILLILITER,
    LITER,
  ];

  static ProductExtraOptionItemCreateDTOUnitTypeEnum? fromJson(dynamic value) => ProductExtraOptionItemCreateDTOUnitTypeEnumTypeTransformer().decode(value);

  static List<ProductExtraOptionItemCreateDTOUnitTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionItemCreateDTOUnitTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionItemCreateDTOUnitTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ProductExtraOptionItemCreateDTOUnitTypeEnum] to String,
/// and [decode] dynamic data back to [ProductExtraOptionItemCreateDTOUnitTypeEnum].
class ProductExtraOptionItemCreateDTOUnitTypeEnumTypeTransformer {
  factory ProductExtraOptionItemCreateDTOUnitTypeEnumTypeTransformer() => _instance ??= const ProductExtraOptionItemCreateDTOUnitTypeEnumTypeTransformer._();

  const ProductExtraOptionItemCreateDTOUnitTypeEnumTypeTransformer._();

  String encode(ProductExtraOptionItemCreateDTOUnitTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ProductExtraOptionItemCreateDTOUnitTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ProductExtraOptionItemCreateDTOUnitTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PIECE': return ProductExtraOptionItemCreateDTOUnitTypeEnum.PIECE;
        case r'GRAM': return ProductExtraOptionItemCreateDTOUnitTypeEnum.GRAM;
        case r'KILOGRAM': return ProductExtraOptionItemCreateDTOUnitTypeEnum.KILOGRAM;
        case r'MILLILITER': return ProductExtraOptionItemCreateDTOUnitTypeEnum.MILLILITER;
        case r'LITER': return ProductExtraOptionItemCreateDTOUnitTypeEnum.LITER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ProductExtraOptionItemCreateDTOUnitTypeEnumTypeTransformer] instance.
  static ProductExtraOptionItemCreateDTOUnitTypeEnumTypeTransformer? _instance;
}


