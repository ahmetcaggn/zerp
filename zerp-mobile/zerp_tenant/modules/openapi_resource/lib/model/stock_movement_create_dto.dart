//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockMovementCreateDTO extends Schema {
  /// Returns a new [StockMovementCreateDTO] instance.
  StockMovementCreateDTO({
    this.stockResourceId,
    this.type,
    this.quantity,
    this.referenceType,
    this.referenceId,
    this.notes,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? stockResourceId;

  final StockMovementCreateDTOTypeEnum? type;

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
  final String? referenceType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? referenceId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? notes;

  /// The factory instance for creating [StockMovementCreateDTO] from JSON.
  static const factory = StockMovementCreateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockMovementCreateDTO &&
    other.stockResourceId == stockResourceId &&
    other.type == type &&
    other.quantity == quantity &&
    other.referenceType == referenceType &&
    other.referenceId == referenceId &&
    other.notes == notes;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (stockResourceId == null ? 0 : stockResourceId!.hashCode) +
    (type == null ? 0 : type!.hashCode) +
    (quantity == null ? 0 : quantity!.hashCode) +
    (referenceType == null ? 0 : referenceType!.hashCode) +
    (referenceId == null ? 0 : referenceId!.hashCode) +
    (notes == null ? 0 : notes!.hashCode);

  @override
  String toString() => 'StockMovementCreateDTO[stockResourceId=$stockResourceId, type=$type, quantity=$quantity, referenceType=$referenceType, referenceId=$referenceId, notes=$notes]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.stockResourceId != null) {
      json[r'stockResourceId'] = this.stockResourceId;
    } else {
      json[r'stockResourceId'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.quantity != null) {
      json[r'quantity'] = this.quantity;
    } else {
      json[r'quantity'] = null;
    }
    if (this.referenceType != null) {
      json[r'referenceType'] = this.referenceType;
    } else {
      json[r'referenceType'] = null;
    }
    if (this.referenceId != null) {
      json[r'referenceId'] = this.referenceId;
    } else {
      json[r'referenceId'] = null;
    }
    if (this.notes != null) {
      json[r'notes'] = this.notes;
    } else {
      json[r'notes'] = null;
    }
    return json;
  }

  /// Returns a new [StockMovementCreateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockMovementCreateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockMovementCreateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockMovementCreateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockMovementCreateDTO(
        stockResourceId: json[r'stockResourceId'] is String ? json[r'stockResourceId'] as String : null,
        type: StockMovementCreateDTOTypeEnum.fromJson(json[r'type']),
        quantity: num.parse('${json[r'quantity']}'),
        referenceType: json[r'referenceType'] is String ? json[r'referenceType'] as String : null,
        referenceId: json[r'referenceId'] is String ? json[r'referenceId'] as String : null,
        notes: json[r'notes'] is String ? json[r'notes'] as String : null,
      );
    }
    return null;
  }

  static List<StockMovementCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockMovementCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockMovementCreateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockMovementCreateDTO> mapFromJson(dynamic json) {
    final map = <String, StockMovementCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockMovementCreateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockMovementCreateDTO-objects as value to a dart map
  static Map<String, List<StockMovementCreateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockMovementCreateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockMovementCreateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockMovementCreateDTO] instances from JSON data.
class StockMovementCreateDTOFactory extends JsonSchemaFactory<StockMovementCreateDTO> {
  const StockMovementCreateDTOFactory();

  @override
  StockMovementCreateDTO fromJson(dynamic json) => StockMovementCreateDTO.fromJson(json)!;
}


class StockMovementCreateDTOTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const StockMovementCreateDTOTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PURCHASE = StockMovementCreateDTOTypeEnum._(r'PURCHASE');
  static const SALE = StockMovementCreateDTOTypeEnum._(r'SALE');
  static const WASTE = StockMovementCreateDTOTypeEnum._(r'WASTE');
  static const ADJUSTMENT = StockMovementCreateDTOTypeEnum._(r'ADJUSTMENT');
  static const TRANSFER = StockMovementCreateDTOTypeEnum._(r'TRANSFER');
  static const RETURN = StockMovementCreateDTOTypeEnum._(r'RETURN');
  static const STOCK_COUNT_CORRECTION = StockMovementCreateDTOTypeEnum._(r'STOCK_COUNT_CORRECTION');

  /// List of all possible values in this [enum][StockMovementCreateDTOTypeEnum].
  static const values = <StockMovementCreateDTOTypeEnum>[
    PURCHASE,
    SALE,
    WASTE,
    ADJUSTMENT,
    TRANSFER,
    RETURN,
    STOCK_COUNT_CORRECTION,
  ];

  static StockMovementCreateDTOTypeEnum? fromJson(dynamic value) => StockMovementCreateDTOTypeEnumTypeTransformer().decode(value);

  static List<StockMovementCreateDTOTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockMovementCreateDTOTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockMovementCreateDTOTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [StockMovementCreateDTOTypeEnum] to String,
/// and [decode] dynamic data back to [StockMovementCreateDTOTypeEnum].
class StockMovementCreateDTOTypeEnumTypeTransformer {
  factory StockMovementCreateDTOTypeEnumTypeTransformer() => _instance ??= const StockMovementCreateDTOTypeEnumTypeTransformer._();

  const StockMovementCreateDTOTypeEnumTypeTransformer._();

  String encode(StockMovementCreateDTOTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a StockMovementCreateDTOTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  StockMovementCreateDTOTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PURCHASE': return StockMovementCreateDTOTypeEnum.PURCHASE;
        case r'SALE': return StockMovementCreateDTOTypeEnum.SALE;
        case r'WASTE': return StockMovementCreateDTOTypeEnum.WASTE;
        case r'ADJUSTMENT': return StockMovementCreateDTOTypeEnum.ADJUSTMENT;
        case r'TRANSFER': return StockMovementCreateDTOTypeEnum.TRANSFER;
        case r'RETURN': return StockMovementCreateDTOTypeEnum.RETURN;
        case r'STOCK_COUNT_CORRECTION': return StockMovementCreateDTOTypeEnum.STOCK_COUNT_CORRECTION;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [StockMovementCreateDTOTypeEnumTypeTransformer] instance.
  static StockMovementCreateDTOTypeEnumTypeTransformer? _instance;
}


