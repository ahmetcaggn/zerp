//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'stock_movement_timeline_bucket_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockMovementTimelineBucketDTO extends Schema {
  /// Returns a new [StockMovementTimelineBucketDTO] instance.
  StockMovementTimelineBucketDTO({
    this.bucketStart,
    this.bucketEnd,
    this.movementDelta,
    this.previousQuantity,
    this.currentQuantity,
    this.movementCount,
  });

  @JsonKey(name: r'bucketStart')
  final DateTime? bucketStart;

  @JsonKey(name: r'bucketEnd')
  final DateTime? bucketEnd;

  @JsonKey(name: r'movementDelta')
  final num? movementDelta;

  @JsonKey(name: r'previousQuantity')
  final num? previousQuantity;

  @JsonKey(name: r'currentQuantity')
  final num? currentQuantity;

  @JsonKey(name: r'movementCount')
  final int? movementCount;

  /// The factory instance for creating [StockMovementTimelineBucketDTO] from JSON.
  static const factory = StockMovementTimelineBucketDTOFactory();

  factory StockMovementTimelineBucketDTO.fromJson(Map<String, dynamic> json) => _$StockMovementTimelineBucketDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockMovementTimelineBucketDTOToJson(this);

  static List<StockMovementTimelineBucketDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockMovementTimelineBucketDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockMovementTimelineBucketDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockMovementTimelineBucketDTO> mapFromJson(dynamic json) {
    final map = <String, StockMovementTimelineBucketDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockMovementTimelineBucketDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockMovementTimelineBucketDTOFactory extends JsonSchemaFactory<StockMovementTimelineBucketDTO> {
  const StockMovementTimelineBucketDTOFactory();

  @override
  StockMovementTimelineBucketDTO fromJson(dynamic json) => StockMovementTimelineBucketDTO.fromJson(json as Map<String, dynamic>);
}




