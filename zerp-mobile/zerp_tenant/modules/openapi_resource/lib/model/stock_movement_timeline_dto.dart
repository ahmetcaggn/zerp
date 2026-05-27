//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'stock_movement_timeline_bucket_dto.dart';


part 'stock_movement_timeline_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockMovementTimelineDTO extends Schema {
  /// Returns a new [StockMovementTimelineDTO] instance.
  StockMovementTimelineDTO({
    this.from,
    this.to,
    this.bucket,
    this.baselineQuantity,
    this.buckets = const [],
  });

  @JsonKey(name: r'from')
  final DateTime? from;

  @JsonKey(name: r'to')
  final DateTime? to;

  @JsonKey(name: r'bucket')
  final String? bucket;

  @JsonKey(name: r'baselineQuantity')
  final num? baselineQuantity;

  @JsonKey(name: r'buckets')
  final List<StockMovementTimelineBucketDTO> buckets;

  /// The factory instance for creating [StockMovementTimelineDTO] from JSON.
  static const factory = StockMovementTimelineDTOFactory();

  factory StockMovementTimelineDTO.fromJson(Map<String, dynamic> json) => _$StockMovementTimelineDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockMovementTimelineDTOToJson(this);

  static List<StockMovementTimelineDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockMovementTimelineDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockMovementTimelineDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockMovementTimelineDTO> mapFromJson(dynamic json) {
    final map = <String, StockMovementTimelineDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockMovementTimelineDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockMovementTimelineDTOFactory extends JsonSchemaFactory<StockMovementTimelineDTO> {
  const StockMovementTimelineDTOFactory();

  @override
  StockMovementTimelineDTO fromJson(dynamic json) => StockMovementTimelineDTO.fromJson(json as Map<String, dynamic>);
}




