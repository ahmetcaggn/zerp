//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class StockMovementDTO extends Schema {
  /// Returns a new [StockMovementDTO] instance.
  StockMovementDTO({
    this.id,
    this.stockResourceId,
    this.stockResourceName,
    this.type,
    this.quantity,
    this.previousQuantity,
    this.newQuantity,
    this.referenceType,
    this.referenceId,
    this.notes,
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
  final String? stockResourceId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? stockResourceName;

  final StockMovementDTOTypeEnum? type;

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
  final num? previousQuantity;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? newQuantity;

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

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? tenantId;

  /// The factory instance for creating [StockMovementDTO] from JSON.
  static const factory = StockMovementDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockMovementDTO &&
    other.id == id &&
    other.stockResourceId == stockResourceId &&
    other.stockResourceName == stockResourceName &&
    other.type == type &&
    other.quantity == quantity &&
    other.previousQuantity == previousQuantity &&
    other.newQuantity == newQuantity &&
    other.referenceType == referenceType &&
    other.referenceId == referenceId &&
    other.notes == notes &&
    other.tenantId == tenantId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (stockResourceId == null ? 0 : stockResourceId!.hashCode) +
    (stockResourceName == null ? 0 : stockResourceName!.hashCode) +
    (type == null ? 0 : type!.hashCode) +
    (quantity == null ? 0 : quantity!.hashCode) +
    (previousQuantity == null ? 0 : previousQuantity!.hashCode) +
    (newQuantity == null ? 0 : newQuantity!.hashCode) +
    (referenceType == null ? 0 : referenceType!.hashCode) +
    (referenceId == null ? 0 : referenceId!.hashCode) +
    (notes == null ? 0 : notes!.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode);

  @override
  String toString() => 'StockMovementDTO[id=$id, stockResourceId=$stockResourceId, stockResourceName=$stockResourceName, type=$type, quantity=$quantity, previousQuantity=$previousQuantity, newQuantity=$newQuantity, referenceType=$referenceType, referenceId=$referenceId, notes=$notes, tenantId=$tenantId]';

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
    if (this.previousQuantity != null) {
      json[r'previousQuantity'] = this.previousQuantity;
    } else {
      json[r'previousQuantity'] = null;
    }
    if (this.newQuantity != null) {
      json[r'newQuantity'] = this.newQuantity;
    } else {
      json[r'newQuantity'] = null;
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
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    return json;
  }

  /// Returns a new [StockMovementDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockMovementDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockMovementDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockMovementDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockMovementDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        stockResourceId: json[r'stockResourceId'] is String ? json[r'stockResourceId'] as String : null,
        stockResourceName: json[r'stockResourceName'] is String ? json[r'stockResourceName'] as String : null,
        type: StockMovementDTOTypeEnum.fromJson(json[r'type']),
        quantity: num.parse('${json[r'quantity']}'),
        previousQuantity: num.parse('${json[r'previousQuantity']}'),
        newQuantity: num.parse('${json[r'newQuantity']}'),
        referenceType: json[r'referenceType'] is String ? json[r'referenceType'] as String : null,
        referenceId: json[r'referenceId'] is String ? json[r'referenceId'] as String : null,
        notes: json[r'notes'] is String ? json[r'notes'] as String : null,
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
      );
    }
    return null;
  }

  static List<StockMovementDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockMovementDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockMovementDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockMovementDTO> mapFromJson(dynamic json) {
    final map = <String, StockMovementDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockMovementDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockMovementDTO-objects as value to a dart map
  static Map<String, List<StockMovementDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockMovementDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockMovementDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockMovementDTO] instances from JSON data.
class StockMovementDTOFactory extends JsonSchemaFactory<StockMovementDTO> {
  const StockMovementDTOFactory();

  @override
  StockMovementDTO fromJson(dynamic json) => StockMovementDTO.fromJson(json)!;
}


class StockMovementDTOTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const StockMovementDTOTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PURCHASE = StockMovementDTOTypeEnum._(r'PURCHASE');
  static const SALE = StockMovementDTOTypeEnum._(r'SALE');
  static const WASTE = StockMovementDTOTypeEnum._(r'WASTE');
  static const ADJUSTMENT = StockMovementDTOTypeEnum._(r'ADJUSTMENT');
  static const TRANSFER = StockMovementDTOTypeEnum._(r'TRANSFER');
  static const RETURN = StockMovementDTOTypeEnum._(r'RETURN');
  static const STOCK_COUNT_CORRECTION = StockMovementDTOTypeEnum._(r'STOCK_COUNT_CORRECTION');

  /// List of all possible values in this [enum][StockMovementDTOTypeEnum].
  static const values = <StockMovementDTOTypeEnum>[
    PURCHASE,
    SALE,
    WASTE,
    ADJUSTMENT,
    TRANSFER,
    RETURN,
    STOCK_COUNT_CORRECTION,
  ];

  static StockMovementDTOTypeEnum? fromJson(dynamic value) => StockMovementDTOTypeEnumTypeTransformer().decode(value);

  static List<StockMovementDTOTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockMovementDTOTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockMovementDTOTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [StockMovementDTOTypeEnum] to String,
/// and [decode] dynamic data back to [StockMovementDTOTypeEnum].
class StockMovementDTOTypeEnumTypeTransformer {
  factory StockMovementDTOTypeEnumTypeTransformer() => _instance ??= const StockMovementDTOTypeEnumTypeTransformer._();

  const StockMovementDTOTypeEnumTypeTransformer._();

  String encode(StockMovementDTOTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a StockMovementDTOTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  StockMovementDTOTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PURCHASE': return StockMovementDTOTypeEnum.PURCHASE;
        case r'SALE': return StockMovementDTOTypeEnum.SALE;
        case r'WASTE': return StockMovementDTOTypeEnum.WASTE;
        case r'ADJUSTMENT': return StockMovementDTOTypeEnum.ADJUSTMENT;
        case r'TRANSFER': return StockMovementDTOTypeEnum.TRANSFER;
        case r'RETURN': return StockMovementDTOTypeEnum.RETURN;
        case r'STOCK_COUNT_CORRECTION': return StockMovementDTOTypeEnum.STOCK_COUNT_CORRECTION;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [StockMovementDTOTypeEnumTypeTransformer] instance.
  static StockMovementDTOTypeEnumTypeTransformer? _instance;
}


