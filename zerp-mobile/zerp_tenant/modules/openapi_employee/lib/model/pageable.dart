//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class Pageable extends Schema {
  /// Returns a new [Pageable] instance.
  Pageable({
    this.page,
    this.size,
    this.sort = const [],
  });

  /// Minimum value: 0
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? page;

  /// Minimum value: 1
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? size;

  final List<String> sort;

  /// The factory instance for creating [Pageable] from JSON.
  static const factory = PageableFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is Pageable &&
    other.page == page &&
    other.size == size &&
    other.sort == sort;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (page == null ? 0 : page!.hashCode) +
    (size == null ? 0 : size!.hashCode) +
    (sort.hashCode);

  @override
  String toString() => 'Pageable[page=$page, size=$size, sort=$sort]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.page != null) {
      json[r'page'] = this.page;
    } else {
      json[r'page'] = null;
    }
    if (this.size != null) {
      json[r'size'] = this.size;
    } else {
      json[r'size'] = null;
    }
      json[r'sort'] = this.sort;
    return json;
  }

  /// Returns a new [Pageable] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Pageable? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "Pageable[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "Pageable[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Pageable(
        page: json[r'page'] is int ? json[r'page'] as int : null,
        size: json[r'size'] is int ? json[r'size'] as int : null,
        sort: json[r'sort'] is Iterable
            ? (json[r'sort'] as Iterable).cast<String>().toList(growable: false)
            : const [],
      );
    }
    return null;
  }

  static List<Pageable> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <Pageable>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Pageable.fromJson(row);
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
        final value = Pageable.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Pageable-objects as value to a dart map
  static Map<String, List<Pageable>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<Pageable>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Pageable.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [Pageable] instances from JSON data.
class PageableFactory extends JsonSchemaFactory<Pageable> {
  const PageableFactory();

  @override
  Pageable fromJson(dynamic json) => Pageable.fromJson(json)!;
}

