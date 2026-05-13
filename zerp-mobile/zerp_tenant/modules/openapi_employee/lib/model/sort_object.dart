//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'sort_object.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class SortObject extends Schema {
  /// Returns a new [SortObject] instance.
  SortObject({
    this.empty,
    this.sorted,
    this.unsorted,
  });

  @JsonKey(name: r'empty')
  final bool? empty;

  @JsonKey(name: r'sorted')
  final bool? sorted;

  @JsonKey(name: r'unsorted')
  final bool? unsorted;

  /// The factory instance for creating [SortObject] from JSON.
  static const factory = SortObjectFactory();

  factory SortObject.fromJson(Map<String, dynamic> json) => _$SortObjectFromJson(json);

  Map<String, dynamic> toJson() => _$SortObjectToJson(this);

  static List<SortObject> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <SortObject>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SortObject.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SortObject> mapFromJson(dynamic json) {
    final map = <String, SortObject>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SortObject.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class SortObjectFactory extends JsonSchemaFactory<SortObject> {
  const SortObjectFactory();

  @override
  SortObject fromJson(dynamic json) => SortObject.fromJson(json as Map<String, dynamic>);
}




