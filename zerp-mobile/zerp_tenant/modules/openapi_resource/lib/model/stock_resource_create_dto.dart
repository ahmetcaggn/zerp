//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockResourceCreateDTO extends Schema {
  /// Returns a new [StockResourceCreateDTO] instance.
  StockResourceCreateDTO({
    this.name,
    this.description,
    this.shopId,
    this.unitType,
    this.quantity,
    this.reorderThreshold,
    this.costPerUnit,
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
  final String? shopId;

  final StockResourceCreateDTOUnitTypeEnum? unitType;

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

  /// The factory instance for creating [StockResourceCreateDTO] from JSON.
  static const factory = StockResourceCreateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockResourceCreateDTO &&
    other.name == name &&
    other.description == description &&
    other.shopId == shopId &&
    other.unitType == unitType &&
    other.quantity == quantity &&
    other.reorderThreshold == reorderThreshold &&
    other.costPerUnit == costPerUnit;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (shopId == null ? 0 : shopId!.hashCode) +
    (unitType == null ? 0 : unitType!.hashCode) +
    (quantity == null ? 0 : quantity!.hashCode) +
    (reorderThreshold == null ? 0 : reorderThreshold!.hashCode) +
    (costPerUnit == null ? 0 : costPerUnit!.hashCode);

  @override
  String toString() => 'StockResourceCreateDTO[name=$name, description=$description, shopId=$shopId, unitType=$unitType, quantity=$quantity, reorderThreshold=$reorderThreshold, costPerUnit=$costPerUnit]';

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
    if (this.shopId != null) {
      json[r'shopId'] = this.shopId;
    } else {
      json[r'shopId'] = null;
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
    return json;
  }

  /// Returns a new [StockResourceCreateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockResourceCreateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockResourceCreateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockResourceCreateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockResourceCreateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        shopId: json[r'shopId'] is String ? json[r'shopId'] as String : null,
        unitType: StockResourceCreateDTOUnitTypeEnum.fromJson(json[r'unitType']),
        quantity: num.parse('${json[r'quantity']}'),
        reorderThreshold: num.parse('${json[r'reorderThreshold']}'),
        costPerUnit: num.parse('${json[r'costPerUnit']}'),
      );
    }
    return null;
  }

  static List<StockResourceCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceCreateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockResourceCreateDTO> mapFromJson(dynamic json) {
    final map = <String, StockResourceCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockResourceCreateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockResourceCreateDTO-objects as value to a dart map
  static Map<String, List<StockResourceCreateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockResourceCreateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockResourceCreateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockResourceCreateDTO] instances from JSON data.
class StockResourceCreateDTOFactory extends JsonSchemaFactory<StockResourceCreateDTO> {
  const StockResourceCreateDTOFactory();

  @override
  StockResourceCreateDTO fromJson(dynamic json) => StockResourceCreateDTO.fromJson(json)!;
}


class StockResourceCreateDTOUnitTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const StockResourceCreateDTOUnitTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PIECE = StockResourceCreateDTOUnitTypeEnum._(r'PIECE');
  static const GRAM = StockResourceCreateDTOUnitTypeEnum._(r'GRAM');
  static const KILOGRAM = StockResourceCreateDTOUnitTypeEnum._(r'KILOGRAM');
  static const MILLILITER = StockResourceCreateDTOUnitTypeEnum._(r'MILLILITER');
  static const LITER = StockResourceCreateDTOUnitTypeEnum._(r'LITER');

  /// List of all possible values in this [enum][StockResourceCreateDTOUnitTypeEnum].
  static const values = <StockResourceCreateDTOUnitTypeEnum>[
    PIECE,
    GRAM,
    KILOGRAM,
    MILLILITER,
    LITER,
  ];

  static StockResourceCreateDTOUnitTypeEnum? fromJson(dynamic value) => StockResourceCreateDTOUnitTypeEnumTypeTransformer().decode(value);

  static List<StockResourceCreateDTOUnitTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceCreateDTOUnitTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceCreateDTOUnitTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [StockResourceCreateDTOUnitTypeEnum] to String,
/// and [decode] dynamic data back to [StockResourceCreateDTOUnitTypeEnum].
class StockResourceCreateDTOUnitTypeEnumTypeTransformer {
  factory StockResourceCreateDTOUnitTypeEnumTypeTransformer() => _instance ??= const StockResourceCreateDTOUnitTypeEnumTypeTransformer._();

  const StockResourceCreateDTOUnitTypeEnumTypeTransformer._();

  String encode(StockResourceCreateDTOUnitTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a StockResourceCreateDTOUnitTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  StockResourceCreateDTOUnitTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PIECE': return StockResourceCreateDTOUnitTypeEnum.PIECE;
        case r'GRAM': return StockResourceCreateDTOUnitTypeEnum.GRAM;
        case r'KILOGRAM': return StockResourceCreateDTOUnitTypeEnum.KILOGRAM;
        case r'MILLILITER': return StockResourceCreateDTOUnitTypeEnum.MILLILITER;
        case r'LITER': return StockResourceCreateDTOUnitTypeEnum.LITER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [StockResourceCreateDTOUnitTypeEnumTypeTransformer] instance.
  static StockResourceCreateDTOUnitTypeEnumTypeTransformer? _instance;
}


