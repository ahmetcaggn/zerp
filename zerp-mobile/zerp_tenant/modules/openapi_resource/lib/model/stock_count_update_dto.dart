//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'stock_count_item_update_dto.dart';

class StockCountUpdateDTO extends Schema {
  /// Returns a new [StockCountUpdateDTO] instance.
  StockCountUpdateDTO({
    this.status,
    this.countDate,
    this.notes,
    this.items = const [],
  });

  final StockCountUpdateDTOStatusEnum? status;

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

  final List<StockCountItemUpdateDTO> items;

  /// The factory instance for creating [StockCountUpdateDTO] from JSON.
  static const factory = StockCountUpdateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is StockCountUpdateDTO &&
    other.status == status &&
    other.countDate == countDate &&
    other.notes == notes &&
    other.items == items;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (status == null ? 0 : status!.hashCode) +
    (countDate == null ? 0 : countDate!.hashCode) +
    (notes == null ? 0 : notes!.hashCode) +
    (items.hashCode);

  @override
  String toString() => 'StockCountUpdateDTO[status=$status, countDate=$countDate, notes=$notes, items=$items]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
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
    return json;
  }

  /// Returns a new [StockCountUpdateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StockCountUpdateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "StockCountUpdateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "StockCountUpdateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return StockCountUpdateDTO(
        status: StockCountUpdateDTOStatusEnum.fromJson(json[r'status']),
        countDate: json[r'countDate'] != null ? DateTime.parse(json[r'countDate'].toString()) : null,
        notes: json[r'notes'] is String ? json[r'notes'] as String : null,
        items: StockCountItemUpdateDTO.listFromJson(json[r'items']),
      );
    }
    return null;
  }

  static List<StockCountUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountUpdateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountUpdateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StockCountUpdateDTO-objects as value to a dart map
  static Map<String, List<StockCountUpdateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StockCountUpdateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StockCountUpdateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [StockCountUpdateDTO] instances from JSON data.
class StockCountUpdateDTOFactory extends JsonSchemaFactory<StockCountUpdateDTO> {
  const StockCountUpdateDTOFactory();

  @override
  StockCountUpdateDTO fromJson(dynamic json) => StockCountUpdateDTO.fromJson(json)!;
}


class StockCountUpdateDTOStatusEnum {
  /// Instantiate a new enum with the provided [value].
  const StockCountUpdateDTOStatusEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const DRAFT = StockCountUpdateDTOStatusEnum._(r'DRAFT');
  static const IN_PROGRESS = StockCountUpdateDTOStatusEnum._(r'IN_PROGRESS');
  static const COMPLETED = StockCountUpdateDTOStatusEnum._(r'COMPLETED');

  /// List of all possible values in this [enum][StockCountUpdateDTOStatusEnum].
  static const values = <StockCountUpdateDTOStatusEnum>[
    DRAFT,
    IN_PROGRESS,
    COMPLETED,
  ];

  static StockCountUpdateDTOStatusEnum? fromJson(dynamic value) => StockCountUpdateDTOStatusEnumTypeTransformer().decode(value);

  static List<StockCountUpdateDTOStatusEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountUpdateDTOStatusEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountUpdateDTOStatusEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [StockCountUpdateDTOStatusEnum] to String,
/// and [decode] dynamic data back to [StockCountUpdateDTOStatusEnum].
class StockCountUpdateDTOStatusEnumTypeTransformer {
  factory StockCountUpdateDTOStatusEnumTypeTransformer() => _instance ??= const StockCountUpdateDTOStatusEnumTypeTransformer._();

  const StockCountUpdateDTOStatusEnumTypeTransformer._();

  String encode(StockCountUpdateDTOStatusEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a StockCountUpdateDTOStatusEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  StockCountUpdateDTOStatusEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'DRAFT': return StockCountUpdateDTOStatusEnum.DRAFT;
        case r'IN_PROGRESS': return StockCountUpdateDTOStatusEnum.IN_PROGRESS;
        case r'COMPLETED': return StockCountUpdateDTOStatusEnum.COMPLETED;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [StockCountUpdateDTOStatusEnumTypeTransformer] instance.
  static StockCountUpdateDTOStatusEnumTypeTransformer? _instance;
}


