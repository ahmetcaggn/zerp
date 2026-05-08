//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'stock_count_item_dto.dart';

class StockCountDTO extends Schema {
  /// Returns a new [StockCountDTO] instance.
  StockCountDTO({
    this.id,
    this.shopId,
    this.shopName,
    this.status,
    this.countDate,
    this.notes,
    this.items = const [],
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
  final String? shopId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? shopName;

  final StockCountDTOStatusEnum? status;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final DateTime? countDate;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? notes;

  final List<StockCountItemDTO> items;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? tenantId;

  /// The factory instance for creating [StockCountDTO] from JSON.
  static const factory = StockCountDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockCountDTO &&
    other.id == id &&
    other.shopId == shopId &&
    other.shopName == shopName &&
    other.status == status &&
    other.countDate == countDate &&
    other.notes == notes &&
    other.items == items &&
    other.tenantId == tenantId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id == null ? 0 : id!.hashCode) +
    (shopId == null ? 0 : shopId!.hashCode) +
    (shopName == null ? 0 : shopName!.hashCode) +
    (status == null ? 0 : status!.hashCode) +
    (countDate == null ? 0 : countDate!.hashCode) +
    (notes == null ? 0 : notes!.hashCode) +
    (items.hashCode) +
    (tenantId == null ? 0 : tenantId!.hashCode);

  @override
  String toString() => 'StockCountDTO[id=$id, shopId=$shopId, shopName=$shopName, status=$status, countDate=$countDate, notes=$notes, items=$items, tenantId=$tenantId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
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
    if (this.status != null) {
      json[r'status'] = this.status;
    } else {
      json[r'status'] = null;
    }
    if (this.countDate != null) {
      json[r'countDate'] = this.countDate!.toUtc().toIso8601String();
    } else {
      json[r'countDate'] = null;
    }
    if (this.notes != null) {
      json[r'notes'] = this.notes;
    } else {
      json[r'notes'] = null;
    }
      json[r'items'] = this.items;
    if (this.tenantId != null) {
      json[r'tenantId'] = this.tenantId;
    } else {
      json[r'tenantId'] = null;
    }
    return json;
  }

  /// Returns a new [StockCountDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockCountDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockCountDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockCountDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockCountDTO(
        id: json[r'id'] is String ? json[r'id'] as String : null,
        shopId: json[r'shopId'] is String ? json[r'shopId'] as String : null,
        shopName: json[r'shopName'] is String ? json[r'shopName'] as String : null,
        status: StockCountDTOStatusEnum.fromJson(json[r'status']),
        countDate: json[r'countDate'] != null ? DateTime.parse(json[r'countDate'].toString()) : null,
        notes: json[r'notes'] is String ? json[r'notes'] as String : null,
        items: StockCountItemDTO.listFromJson(json[r'items']),
        tenantId: json[r'tenantId'] is String ? json[r'tenantId'] as String : null,
      );
    }
    return null;
  }

  static List<StockCountDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockCountDTO-objects as value to a dart map
  static Map<String, List<StockCountDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockCountDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockCountDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockCountDTO] instances from JSON data.
class StockCountDTOFactory extends JsonSchemaFactory<StockCountDTO> {
  const StockCountDTOFactory();

  @override
  StockCountDTO fromJson(dynamic json) => StockCountDTO.fromJson(json)!;
}


class StockCountDTOStatusEnum {
  /// Instantiate a new enum with the provided [value].
  const StockCountDTOStatusEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const DRAFT = StockCountDTOStatusEnum._(r'DRAFT');
  static const IN_PROGRESS = StockCountDTOStatusEnum._(r'IN_PROGRESS');
  static const COMPLETED = StockCountDTOStatusEnum._(r'COMPLETED');

  /// List of all possible values in this [enum][StockCountDTOStatusEnum].
  static const values = <StockCountDTOStatusEnum>[
    DRAFT,
    IN_PROGRESS,
    COMPLETED,
  ];

  static StockCountDTOStatusEnum? fromJson(dynamic value) => StockCountDTOStatusEnumTypeTransformer().decode(value);

  static List<StockCountDTOStatusEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountDTOStatusEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountDTOStatusEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [StockCountDTOStatusEnum] to String,
/// and [decode] dynamic data back to [StockCountDTOStatusEnum].
class StockCountDTOStatusEnumTypeTransformer {
  factory StockCountDTOStatusEnumTypeTransformer() => _instance ??= const StockCountDTOStatusEnumTypeTransformer._();

  const StockCountDTOStatusEnumTypeTransformer._();

  String encode(StockCountDTOStatusEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a StockCountDTOStatusEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  StockCountDTOStatusEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'DRAFT': return StockCountDTOStatusEnum.DRAFT;
        case r'IN_PROGRESS': return StockCountDTOStatusEnum.IN_PROGRESS;
        case r'COMPLETED': return StockCountDTOStatusEnum.COMPLETED;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [StockCountDTOStatusEnumTypeTransformer] instance.
  static StockCountDTOStatusEnumTypeTransformer? _instance;
}


