//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'sort_object.dart';

class PageableObject extends Schema {
  /// Returns a new [PageableObject] instance.
  PageableObject({
    this.paged,
    this.pageNumber,
    this.pageSize,
    this.sort,
    this.unpaged,
    this.offset,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? paged;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? pageNumber;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? pageSize;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final SortObject? sort;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? unpaged;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? offset;

  /// The factory instance for creating [PageableObject] from JSON.
  static const factory = PageableObjectFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is PageableObject &&
    other.paged == paged &&
    other.pageNumber == pageNumber &&
    other.pageSize == pageSize &&
    other.sort == sort &&
    other.unpaged == unpaged &&
    other.offset == offset;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (paged == null ? 0 : paged!.hashCode) +
    (pageNumber == null ? 0 : pageNumber!.hashCode) +
    (pageSize == null ? 0 : pageSize!.hashCode) +
    (sort == null ? 0 : sort!.hashCode) +
    (unpaged == null ? 0 : unpaged!.hashCode) +
    (offset == null ? 0 : offset!.hashCode);

  @override
  String toString() => 'PageableObject[paged=$paged, pageNumber=$pageNumber, pageSize=$pageSize, sort=$sort, unpaged=$unpaged, offset=$offset]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.paged != null) {
      json[r'paged'] = this.paged;
    } else {
      json[r'paged'] = null;
    }
    if (this.pageNumber != null) {
      json[r'pageNumber'] = this.pageNumber;
    } else {
      json[r'pageNumber'] = null;
    }
    if (this.pageSize != null) {
      json[r'pageSize'] = this.pageSize;
    } else {
      json[r'pageSize'] = null;
    }
    if (this.sort != null) {
      json[r'sort'] = this.sort;
    } else {
      json[r'sort'] = null;
    }
    if (this.unpaged != null) {
      json[r'unpaged'] = this.unpaged;
    } else {
      json[r'unpaged'] = null;
    }
    if (this.offset != null) {
      json[r'offset'] = this.offset;
    } else {
      json[r'offset'] = null;
    }
    return json;
  }

  /// Returns a new [PageableObject] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PageableObject? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "PageableObject[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "PageableObject[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PageableObject(
        paged: json[r'paged'] is bool ? json[r'paged'] as bool : null,
        pageNumber: json[r'pageNumber'] is int ? json[r'pageNumber'] as int : null,
        pageSize: json[r'pageSize'] is int ? json[r'pageSize'] as int : null,
        sort: SortObject.fromJson(json[r'sort']),
        unpaged: json[r'unpaged'] is bool ? json[r'unpaged'] as bool : null,
        offset: json[r'offset'] is int ? json[r'offset'] as int : null,
      );
    }
    return null;
  }

  static List<PageableObject> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PageableObject>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PageableObject.fromJson(row);
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
        final value = PageableObject.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PageableObject-objects as value to a dart map
  static Map<String, List<PageableObject>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PageableObject>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PageableObject.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [PageableObject] instances from JSON data.
class PageableObjectFactory extends JsonSchemaFactory<PageableObject> {
  const PageableObjectFactory();

  @override
  PageableObject fromJson(dynamic json) => PageableObject.fromJson(json)!;
}

