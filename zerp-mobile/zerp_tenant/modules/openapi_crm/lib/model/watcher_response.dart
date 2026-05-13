//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'watcher_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class WatcherResponse extends Schema {
  /// Returns a new [WatcherResponse] instance.
  WatcherResponse({
    this.watcherId,
    this.addedAt,
  });

  @JsonKey(name: r'watcherId')
  final String? watcherId;

  @JsonKey(name: r'addedAt')
  final DateTime? addedAt;

  /// The factory instance for creating [WatcherResponse] from JSON.
  static const factory = WatcherResponseFactory();

  factory WatcherResponse.fromJson(Map<String, dynamic> json) => _$WatcherResponseFromJson(json);

  Map<String, dynamic> toJson() => _$WatcherResponseToJson(this);

  static List<WatcherResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <WatcherResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = WatcherResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, WatcherResponse> mapFromJson(dynamic json) {
    final map = <String, WatcherResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = WatcherResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class WatcherResponseFactory extends JsonSchemaFactory<WatcherResponse> {
  const WatcherResponseFactory();

  @override
  WatcherResponse fromJson(dynamic json) => WatcherResponse.fromJson(json as Map<String, dynamic>);
}




