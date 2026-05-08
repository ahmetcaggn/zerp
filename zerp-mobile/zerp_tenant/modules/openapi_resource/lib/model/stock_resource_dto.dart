//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockResourceDTO extends Schema {
  /// Returns a new [StockResourceDTO] instance.
  StockResourceDTO({
    this.id,
    this.name,
    this.description,
    this.shopId,
    this.shopName,
    this.unitType,
    this.quantity,
    this.reorderThreshold,
    this.costPerUnit,
    this.tenantId,
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
  final String? shopId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? shopName;

  final StockResourceDTOUnitTypeEnum? unitType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? quantity;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? reorderThreshold;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? costPerUnit;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? tenantId;

  /// The factory instance for creating [StockResourceDTO] from JSON.
  static const factory = StockResourceDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockResourceDTO &&
    other.id == id &&
    other.name == name &&
    other.description == description &&
    other.shopId == shopId &&
    other.shopName == shopName &&
    other.unitType == unitType &&
    other.quantity == quantity &&
    other.reorderThreshold == reorderThreshold &&
    other.costPerUnit == costPerUnit &&
    other.tenantId == tenantId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (shopId == null ? 0 : shopId!.hashCode) +
    (shopName == null ? 0 : shopName!.hashCode) +
    (unitType == null ? 0 : unitType!.hashCode) +
    (quantity == null ? 0 : quantity!.hashCode) +
    (reorderThreshold == null ? 0 : reorderThreshold!.hashCode) +
    (costPerUnit == null ? 0 : costPerUnit!.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode);

  @override
  String toString() => 'StockResourceDTO[id=$id, name=$name, description=$description, shopId=$shopId, shopName=$shopName, unitType=$unitType, quantity=$quantity, reorderThreshold=$reorderThreshold, costPerUnit=$costPerUnit, tenantId=$tenantId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
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
    if (this.shopId != null) {
      json[r'shopId'] = this.shopId;
    } else {
      json[r'shopId'] = null;
    }
    if (this.shopName != null) {
      json[r'shopName'] = this.shopName;
    } else {
      json[r'shopName'] = null;
    }
    if (this.unitType != null) {
      json[r'unitType'] = this.unitType;
    } else {
      json[r'unitType'] = null;
    }
    if (this.quantity != null) {
      json[r'quantity'] = this.quantity;
    } else {
      json[r'quantity'] = null;
    }
    if (this.reorderThreshold != null) {
      json[r'reorderThreshold'] = this.reorderThreshold;
    } else {
      json[r'reorderThreshold'] = null;
    }
    if (this.costPerUnit != null) {
      json[r'costPerUnit'] = this.costPerUnit;
    } else {
      json[r'costPerUnit'] = null;
    }
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    return json;
  }

  /// Returns a new [StockResourceDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockResourceDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockResourceDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockResourceDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockResourceDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        shopId: json[r'shopId'] is String ? json[r'shopId'] as String : null,
        shopName: json[r'shopName'] is String ? json[r'shopName'] as String : null,
        unitType: StockResourceDTOUnitTypeEnum.fromJson(json[r'unitType']),
        quantity: num.parse('${json[r'quantity']}'),
        reorderThreshold: num.parse('${json[r'reorderThreshold']}'),
        costPerUnit: num.parse('${json[r'costPerUnit']}'),
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
      );
    }
    return null;
  }

  static List<StockResourceDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockResourceDTO> mapFromJson(dynamic json) {
    final map = <String, StockResourceDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockResourceDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockResourceDTO-objects as value to a dart map
  static Map<String, List<StockResourceDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockResourceDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockResourceDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockResourceDTO] instances from JSON data.
class StockResourceDTOFactory extends JsonSchemaFactory<StockResourceDTO> {
  const StockResourceDTOFactory();

  @override
  StockResourceDTO fromJson(dynamic json) => StockResourceDTO.fromJson(json)!;
}


class StockResourceDTOUnitTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const StockResourceDTOUnitTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PIECE = StockResourceDTOUnitTypeEnum._(r'PIECE');
  static const GRAM = StockResourceDTOUnitTypeEnum._(r'GRAM');
  static const KILOGRAM = StockResourceDTOUnitTypeEnum._(r'KILOGRAM');
  static const MILLILITER = StockResourceDTOUnitTypeEnum._(r'MILLILITER');
  static const LITER = StockResourceDTOUnitTypeEnum._(r'LITER');

  /// List of all possible values in this [enum][StockResourceDTOUnitTypeEnum].
  static const values = <StockResourceDTOUnitTypeEnum>[
    PIECE,
    GRAM,
    KILOGRAM,
    MILLILITER,
    LITER,
  ];

  static StockResourceDTOUnitTypeEnum? fromJson(dynamic value) => StockResourceDTOUnitTypeEnumTypeTransformer().decode(value);

  static List<StockResourceDTOUnitTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceDTOUnitTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceDTOUnitTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [StockResourceDTOUnitTypeEnum] to String,
/// and [decode] dynamic data back to [StockResourceDTOUnitTypeEnum].
class StockResourceDTOUnitTypeEnumTypeTransformer {
  factory StockResourceDTOUnitTypeEnumTypeTransformer() => _instance ??= const StockResourceDTOUnitTypeEnumTypeTransformer._();

  const StockResourceDTOUnitTypeEnumTypeTransformer._();

  String encode(StockResourceDTOUnitTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a StockResourceDTOUnitTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  StockResourceDTOUnitTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PIECE': return StockResourceDTOUnitTypeEnum.PIECE;
        case r'GRAM': return StockResourceDTOUnitTypeEnum.GRAM;
        case r'KILOGRAM': return StockResourceDTOUnitTypeEnum.KILOGRAM;
        case r'MILLILITER': return StockResourceDTOUnitTypeEnum.MILLILITER;
        case r'LITER': return StockResourceDTOUnitTypeEnum.LITER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [StockResourceDTOUnitTypeEnumTypeTransformer] instance.
  static StockResourceDTOUnitTypeEnumTypeTransformer? _instance;
}


