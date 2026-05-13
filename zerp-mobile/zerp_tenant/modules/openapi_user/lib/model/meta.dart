//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'meta.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class Meta extends Schema {
  /// Returns a new [Meta] instance.
  Meta({
    this.traceId,
    this.path,
    this.durationMs,
    this.version,
    this.timestamp,
  });

  @JsonKey(name: r'traceId')
  final String? traceId;

  @JsonKey(name: r'path')
  final String? path;

  @JsonKey(name: r'durationMs')
  final int? durationMs;

  @JsonKey(name: r'version')
  final String? version;

  @JsonKey(name: r'timestamp')
  final DateTime? timestamp;

  /// The factory instance for creating [Meta] from JSON.
  static const factory = MetaFactory();

  factory Meta.fromJson(Map<String, dynamic> json) => _$MetaFromJson(json);

  Map<String, dynamic> toJson() => _$MetaToJson(this);

  static List<Meta> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <Meta>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Meta.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Meta> mapFromJson(dynamic json) {
    final map = <String, Meta>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Meta.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class MetaFactory extends JsonSchemaFactory<Meta> {
  const MetaFactory();

  @override
  Meta fromJson(dynamic json) => Meta.fromJson(json as Map<String, dynamic>);
}




