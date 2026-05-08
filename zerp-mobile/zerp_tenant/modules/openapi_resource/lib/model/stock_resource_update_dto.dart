//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockResourceUpdateDTO extends Schema {
  /// Returns a new [StockResourceUpdateDTO] instance.
  StockResourceUpdateDTO({
    this.name,
    this.description,
    this.unitType,
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

  final StockResourceUpdateDTOUnitTypeEnum? unitType;

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

  /// The factory instance for creating [StockResourceUpdateDTO] from JSON.
  static const factory = StockResourceUpdateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockResourceUpdateDTO &&
    other.name == name &&
    other.description == description &&
    other.unitType == unitType &&
    other.reorderThreshold == reorderThreshold &&
    other.costPerUnit == costPerUnit;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (unitType == null ? 0 : unitType!.hashCode) +
    (reorderThreshold == null ? 0 : reorderThreshold!.hashCode) +
    (costPerUnit == null ? 0 : costPerUnit!.hashCode);

  @override
  String toString() => 'StockResourceUpdateDTO[name=$name, description=$description, unitType=$unitType, reorderThreshold=$reorderThreshold, costPerUnit=$costPerUnit]';

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
    if (this.unitType != null) {
      json[r'unitType'] = this.unitType;
    } else {
      json[r'unitType'] = null;
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

  /// Returns a new [StockResourceUpdateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockResourceUpdateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockResourceUpdateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockResourceUpdateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockResourceUpdateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        unitType: StockResourceUpdateDTOUnitTypeEnum.fromJson(json[r'unitType']),
        reorderThreshold: num.parse('${json[r'reorderThreshold']}'),
        costPerUnit: num.parse('${json[r'costPerUnit']}'),
      );
    }
    return null;
  }

  static List<StockResourceUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceUpdateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockResourceUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, StockResourceUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockResourceUpdateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockResourceUpdateDTO-objects as value to a dart map
  static Map<String, List<StockResourceUpdateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockResourceUpdateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockResourceUpdateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockResourceUpdateDTO] instances from JSON data.
class StockResourceUpdateDTOFactory extends JsonSchemaFactory<StockResourceUpdateDTO> {
  const StockResourceUpdateDTOFactory();

  @override
  StockResourceUpdateDTO fromJson(dynamic json) => StockResourceUpdateDTO.fromJson(json)!;
}


class StockResourceUpdateDTOUnitTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const StockResourceUpdateDTOUnitTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PIECE = StockResourceUpdateDTOUnitTypeEnum._(r'PIECE');
  static const GRAM = StockResourceUpdateDTOUnitTypeEnum._(r'GRAM');
  static const KILOGRAM = StockResourceUpdateDTOUnitTypeEnum._(r'KILOGRAM');
  static const MILLILITER = StockResourceUpdateDTOUnitTypeEnum._(r'MILLILITER');
  static const LITER = StockResourceUpdateDTOUnitTypeEnum._(r'LITER');

  /// List of all possible values in this [enum][StockResourceUpdateDTOUnitTypeEnum].
  static const values = <StockResourceUpdateDTOUnitTypeEnum>[
    PIECE,
    GRAM,
    KILOGRAM,
    MILLILITER,
    LITER,
  ];

  static StockResourceUpdateDTOUnitTypeEnum? fromJson(dynamic value) => StockResourceUpdateDTOUnitTypeEnumTypeTransformer().decode(value);

  static List<StockResourceUpdateDTOUnitTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockResourceUpdateDTOUnitTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockResourceUpdateDTOUnitTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [StockResourceUpdateDTOUnitTypeEnum] to String,
/// and [decode] dynamic data back to [StockResourceUpdateDTOUnitTypeEnum].
class StockResourceUpdateDTOUnitTypeEnumTypeTransformer {
  factory StockResourceUpdateDTOUnitTypeEnumTypeTransformer() => _instance ??= const StockResourceUpdateDTOUnitTypeEnumTypeTransformer._();

  const StockResourceUpdateDTOUnitTypeEnumTypeTransformer._();

  String encode(StockResourceUpdateDTOUnitTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a StockResourceUpdateDTOUnitTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  StockResourceUpdateDTOUnitTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PIECE': return StockResourceUpdateDTOUnitTypeEnum.PIECE;
        case r'GRAM': return StockResourceUpdateDTOUnitTypeEnum.GRAM;
        case r'KILOGRAM': return StockResourceUpdateDTOUnitTypeEnum.KILOGRAM;
        case r'MILLILITER': return StockResourceUpdateDTOUnitTypeEnum.MILLILITER;
        case r'LITER': return StockResourceUpdateDTOUnitTypeEnum.LITER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [StockResourceUpdateDTOUnitTypeEnumTypeTransformer] instance.
  static StockResourceUpdateDTOUnitTypeEnumTypeTransformer? _instance;
}


