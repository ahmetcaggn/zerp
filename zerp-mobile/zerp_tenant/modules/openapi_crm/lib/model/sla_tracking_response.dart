//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'sla_tracking_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class SlaTrackingResponse extends Schema {
  /// Returns a new [SlaTrackingResponse] instance.
  SlaTrackingResponse({
    this.firstResponseDueAt,
    this.firstResponseAt,
    this.isFirstResponseBreached,
    this.resolutionDueAt,
    this.resolutionAt,
    this.isResolutionBreached,
    this.totalPausedTimeMinutes,
  });

  @JsonKey(name: r'firstResponseDueAt')
  final DateTime? firstResponseDueAt;

  @JsonKey(name: r'firstResponseAt')
  final DateTime? firstResponseAt;

  @JsonKey(name: r'isFirstResponseBreached')
  final bool? isFirstResponseBreached;

  @JsonKey(name: r'resolutionDueAt')
  final DateTime? resolutionDueAt;

  @JsonKey(name: r'resolutionAt')
  final DateTime? resolutionAt;

  @JsonKey(name: r'isResolutionBreached')
  final bool? isResolutionBreached;

  @JsonKey(name: r'totalPausedTimeMinutes')
  final int? totalPausedTimeMinutes;

  /// The factory instance for creating [SlaTrackingResponse] from JSON.
  static const factory = SlaTrackingResponseFactory();

  factory SlaTrackingResponse.fromJson(Map<String, dynamic> json) => _$SlaTrackingResponseFromJson(json);

  Map<String, dynamic> toJson() => _$SlaTrackingResponseToJson(this);

  static List<SlaTrackingResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SlaTrackingResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SlaTrackingResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SlaTrackingResponse> mapFromJson(dynamic json) {
    final map = <String, SlaTrackingResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SlaTrackingResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class SlaTrackingResponseFactory extends JsonSchemaFactory<SlaTrackingResponse> {
  const SlaTrackingResponseFactory();

  @override
  SlaTrackingResponse fromJson(dynamic json) => SlaTrackingResponse.fromJson(json as Map<String, dynamic>);
}




