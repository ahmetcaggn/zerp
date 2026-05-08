//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class ProductExtraOptionItemDTO extends Schema {
  /// Returns a new [ProductExtraOptionItemDTO] instance.
  ProductExtraOptionItemDTO({
    this.id,
    this.stockResourceId,
    this.stockResourceName,
    this.quantity,
    this.unitType,
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

  final ProductExtraOptionItemDTOUnitTypeEnum? unitType;

  /// The factory instance for creating [ProductExtraOptionItemDTO] from JSON.
  static const factory = ProductExtraOptionItemDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProductExtraOptionItemDTO &&
    other.id == id &&
    other.stockResourceId == stockResourceId &&
    other.stockResourceName == stockResourceName &&
    other.quantity == quantity &&
    other.unitType == unitType;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (stockResourceId == null ? 0 : stockResourceId!.hashCode) +
    (stockResourceName == null ? 0 : stockResourceName!.hashCode) +
    (quantity == null ? 0 : quantity!.hashCode) +
    (unitType == null ? 0 : unitType!.hashCode);

  @override
  String toString() => 'ProductExtraOptionItemDTO[id=$id, stockResourceId=$stockResourceId, stockResourceName=$stockResourceName, quantity=$quantity, unitType=$unitType]';

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
    return json;
  }

  /// Returns a new [ProductExtraOptionItemDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductExtraOptionItemDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ProductExtraOptionItemDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ProductExtraOptionItemDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductExtraOptionItemDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        stockResourceId: json[r'stockResourceId'] is String ? json[r'stockResourceId'] as String : null,
        stockResourceName: json[r'stockResourceName'] is String ? json[r'stockResourceName'] as String : null,
        quantity: num.parse('${json[r'quantity']}'),
        unitType: ProductExtraOptionItemDTOUnitTypeEnum.fromJson(json[r'unitType']),
      );
    }
    return null;
  }

  static List<ProductExtraOptionItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionItemDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductExtraOptionItemDTO> mapFromJson(dynamic json) {
    final map = <String, ProductExtraOptionItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductExtraOptionItemDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductExtraOptionItemDTO-objects as value to a dart map
  static Map<String, List<ProductExtraOptionItemDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProductExtraOptionItemDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductExtraOptionItemDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ProductExtraOptionItemDTO] instances from JSON data.
class ProductExtraOptionItemDTOFactory extends JsonSchemaFactory<ProductExtraOptionItemDTO> {
  const ProductExtraOptionItemDTOFactory();

  @override
  ProductExtraOptionItemDTO fromJson(dynamic json) => ProductExtraOptionItemDTO.fromJson(json)!;
}


class ProductExtraOptionItemDTOUnitTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const ProductExtraOptionItemDTOUnitTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PIECE = ProductExtraOptionItemDTOUnitTypeEnum._(r'PIECE');
  static const GRAM = ProductExtraOptionItemDTOUnitTypeEnum._(r'GRAM');
  static const KILOGRAM = ProductExtraOptionItemDTOUnitTypeEnum._(r'KILOGRAM');
  static const MILLILITER = ProductExtraOptionItemDTOUnitTypeEnum._(r'MILLILITER');
  static const LITER = ProductExtraOptionItemDTOUnitTypeEnum._(r'LITER');

  /// List of all possible values in this [enum][ProductExtraOptionItemDTOUnitTypeEnum].
  static const values = <ProductExtraOptionItemDTOUnitTypeEnum>[
    PIECE,
    GRAM,
    KILOGRAM,
    MILLILITER,
    LITER,
  ];

  static ProductExtraOptionItemDTOUnitTypeEnum? fromJson(dynamic value) => ProductExtraOptionItemDTOUnitTypeEnumTypeTransformer().decode(value);

  static List<ProductExtraOptionItemDTOUnitTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProductExtraOptionItemDTOUnitTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductExtraOptionItemDTOUnitTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ProductExtraOptionItemDTOUnitTypeEnum] to String,
/// and [decode] dynamic data back to [ProductExtraOptionItemDTOUnitTypeEnum].
class ProductExtraOptionItemDTOUnitTypeEnumTypeTransformer {
  factory ProductExtraOptionItemDTOUnitTypeEnumTypeTransformer() => _instance ??= const ProductExtraOptionItemDTOUnitTypeEnumTypeTransformer._();

  const ProductExtraOptionItemDTOUnitTypeEnumTypeTransformer._();

  String encode(ProductExtraOptionItemDTOUnitTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ProductExtraOptionItemDTOUnitTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ProductExtraOptionItemDTOUnitTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PIECE': return ProductExtraOptionItemDTOUnitTypeEnum.PIECE;
        case r'GRAM': return ProductExtraOptionItemDTOUnitTypeEnum.GRAM;
        case r'KILOGRAM': return ProductExtraOptionItemDTOUnitTypeEnum.KILOGRAM;
        case r'MILLILITER': return ProductExtraOptionItemDTOUnitTypeEnum.MILLILITER;
        case r'LITER': return ProductExtraOptionItemDTOUnitTypeEnum.LITER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ProductExtraOptionItemDTOUnitTypeEnumTypeTransformer] instance.
  static ProductExtraOptionItemDTOUnitTypeEnumTypeTransformer? _instance;
}


