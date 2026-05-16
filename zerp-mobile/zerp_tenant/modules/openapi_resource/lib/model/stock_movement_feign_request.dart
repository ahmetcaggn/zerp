//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_movement_feign_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockMovementFeignRequest extends Schema {
  /// Returns a new [StockMovementFeignRequest] instance.
  StockMovementFeignRequest({
    this.stockResourceId,
    this.type,
    this.quantity,
    this.referenceType,
    this.referenceId,
    this.notes,
    this.tenantId,
  });

  @JsonKey(name: r'stockResourceId')
  final String? stockResourceId;

  @JsonKey(name: r'type')
  final StockMovementFeignRequestTypeEnum? type;

  @JsonKey(name: r'quantity')
  final num? quantity;

  @JsonKey(name: r'referenceType')
  final String? referenceType;

  @JsonKey(name: r'referenceId')
  final String? referenceId;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [StockMovementFeignRequest] from JSON.
  static const factory = StockMovementFeignRequestFactory();

  factory StockMovementFeignRequest.fromJson(Map<String, dynamic> json) => _$StockMovementFeignRequestFromJson(json);

  Map<String, dynamic> toJson() => _$StockMovementFeignRequestToJson(this);

  static List<StockMovementFeignRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockMovementFeignRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockMovementFeignRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockMovementFeignRequest> mapFromJson(dynamic json) {
    final map = <String, StockMovementFeignRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockMovementFeignRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockMovementFeignRequestFactory extends JsonSchemaFactory<StockMovementFeignRequest> {
  const StockMovementFeignRequestFactory();

  @override
  StockMovementFeignRequest fromJson(dynamic json) => StockMovementFeignRequest.fromJson(json as Map<String, dynamic>);
}



enum StockMovementFeignRequestTypeEnum {
@JsonValue('PURCHASE')
PURCHASE('PURCHASE'),
@JsonValue('SALE')
SALE('SALE'),
@JsonValue('WASTE')
WASTE('WASTE'),
@JsonValue('ADJUSTMENT')
ADJUSTMENT('ADJUSTMENT'),
@JsonValue('TRANSFER')
TRANSFER('TRANSFER'),
@JsonValue('RETURN')
RETURN('RETURN'),
@JsonValue('STOCK_COUNT_CORRECTION')
STOCK_COUNT_CORRECTION('STOCK_COUNT_CORRECTION');

const StockMovementFeignRequestTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




