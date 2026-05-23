//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'sort_object.dart';


part 'pageable_object.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PageableObject extends Schema {
  /// Returns a new [PageableObject] instance.
  PageableObject({
    this.offset,
    this.sort,
    this.paged,
    this.pageNumber,
    this.pageSize,
    this.unpaged,
  });

  @JsonKey(name: r'offset')
  final int? offset;

  @JsonKey(name: r'sort')
  final SortObject? sort;

  @JsonKey(name: r'paged')
  final bool? paged;

  @JsonKey(name: r'pageNumber')
  final int? pageNumber;

  @JsonKey(name: r'pageSize')
  final int? pageSize;

  @JsonKey(name: r'unpaged')
  final bool? unpaged;

  /// The factory instance for creating [PageableObject] from JSON.
  static const factory = PageableObjectFactory();

  factory PageableObject.fromJson(Map<String, dynamic> json) => _$PageableObjectFromJson(json);

  Map<String, dynamic> toJson() => _$PageableObjectToJson(this);

  static List<PageableObject> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PageableObject>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PageableObject.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PageableObject> mapFromJson(dynamic json) {
    final map = <String, PageableObject>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PageableObject.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PageableObjectFactory extends JsonSchemaFactory<PageableObject> {
  const PageableObjectFactory();

  @override
  PageableObject fromJson(dynamic json) => PageableObject.fromJson(json as Map<String, dynamic>);
}




