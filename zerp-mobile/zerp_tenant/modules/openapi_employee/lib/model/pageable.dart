//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'pageable.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class Pageable extends Schema {
  /// Returns a new [Pageable] instance.
  Pageable({
    this.page,
    this.size,
    this.sort = const [],
  });

  @JsonKey(name: r'page')
  final int? page;

  @JsonKey(name: r'size')
  final int? size;

  @JsonKey(name: r'sort')
  final List<String> sort;

  /// The factory instance for creating [Pageable] from JSON.
  static const factory = PageableFactory();

  factory Pageable.fromJson(Map<String, dynamic> json) => _$PageableFromJson(json);

  Map<String, dynamic> toJson() => _$PageableToJson(this);

  static List<Pageable> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <Pageable>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Pageable.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Pageable> mapFromJson(dynamic json) {
    final map = <String, Pageable>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Pageable.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PageableFactory extends JsonSchemaFactory<Pageable> {
  const PageableFactory();

  @override
  Pageable fromJson(dynamic json) => Pageable.fromJson(json as Map<String, dynamic>);
}




