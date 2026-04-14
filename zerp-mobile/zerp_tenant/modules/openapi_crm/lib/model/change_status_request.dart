//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class ChangeStatusRequest extends Schema {
  /// Returns a new [ChangeStatusRequest] instance.
  ChangeStatusRequest({
    this.status,
  });

  final ChangeStatusRequestStatusEnum? status;

  /// The factory instance for creating [ChangeStatusRequest] from JSON.
  static const factory = ChangeStatusRequestFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is ChangeStatusRequest &&
    other.status == status;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (status == null ? 0 : status!.hashCode);

  @override
  String toString() => 'ChangeStatusRequest[status=$status]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.status != null) {
      json[r'status'] = this.status;
    } else {
      json[r'status'] = null;
    }
    return json;
  }

  /// Returns a new [ChangeStatusRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ChangeStatusRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ChangeStatusRequest[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ChangeStatusRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ChangeStatusRequest(
        status: ChangeStatusRequestStatusEnum.fromJson(json[r'status']),
      );
    }
    return null;
  }

  static List<ChangeStatusRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChangeStatusRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeStatusRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChangeStatusRequest> mapFromJson(dynamic json) {
    final map = <String, ChangeStatusRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChangeStatusRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ChangeStatusRequest-objects as value to a dart map
  static Map<String, List<ChangeStatusRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ChangeStatusRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ChangeStatusRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [ChangeStatusRequest] instances from JSON data.
class ChangeStatusRequestFactory extends JsonSchemaFactory<ChangeStatusRequest> {
  const ChangeStatusRequestFactory();

  @override
  ChangeStatusRequest fromJson(dynamic json) => ChangeStatusRequest.fromJson(json)!;
}


class ChangeStatusRequestStatusEnum {
  /// Instantiate a new enum with the provided [value].
  const ChangeStatusRequestStatusEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const OPEN = ChangeStatusRequestStatusEnum._(r'OPEN');
  static const IN_PROGRESS = ChangeStatusRequestStatusEnum._(r'IN_PROGRESS');
  static const WAITING_CUSTOMER = ChangeStatusRequestStatusEnum._(r'WAITING_CUSTOMER');
  static const RESOLVED = ChangeStatusRequestStatusEnum._(r'RESOLVED');
  static const CLOSED = ChangeStatusRequestStatusEnum._(r'CLOSED');
  static const CANCELLED = ChangeStatusRequestStatusEnum._(r'CANCELLED');

  /// List of all possible values in this [enum][ChangeStatusRequestStatusEnum].
  static const values = <ChangeStatusRequestStatusEnum>[
    OPEN,
    IN_PROGRESS,
    WAITING_CUSTOMER,
    RESOLVED,
    CLOSED,
    CANCELLED,
  ];

  static ChangeStatusRequestStatusEnum? fromJson(dynamic value) => ChangeStatusRequestStatusEnumTypeTransformer().decode(value);

  static List<ChangeStatusRequestStatusEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChangeStatusRequestStatusEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeStatusRequestStatusEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ChangeStatusRequestStatusEnum] to String,
/// and [decode] dynamic data back to [ChangeStatusRequestStatusEnum].
class ChangeStatusRequestStatusEnumTypeTransformer {
  factory ChangeStatusRequestStatusEnumTypeTransformer() => _instance ??= const ChangeStatusRequestStatusEnumTypeTransformer._();

  const ChangeStatusRequestStatusEnumTypeTransformer._();

  String encode(ChangeStatusRequestStatusEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ChangeStatusRequestStatusEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ChangeStatusRequestStatusEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'OPEN': return ChangeStatusRequestStatusEnum.OPEN;
        case r'IN_PROGRESS': return ChangeStatusRequestStatusEnum.IN_PROGRESS;
        case r'WAITING_CUSTOMER': return ChangeStatusRequestStatusEnum.WAITING_CUSTOMER;
        case r'RESOLVED': return ChangeStatusRequestStatusEnum.RESOLVED;
        case r'CLOSED': return ChangeStatusRequestStatusEnum.CLOSED;
        case r'CANCELLED': return ChangeStatusRequestStatusEnum.CANCELLED;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ChangeStatusRequestStatusEnumTypeTransformer] instance.
  static ChangeStatusRequestStatusEnumTypeTransformer? _instance;
}


