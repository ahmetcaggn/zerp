//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'employee_list_response_dto.dart';
import 'pageable_object.dart';
import 'sort_object.dart';

class PageEmployeeListResponseDto extends Schema {
  /// Returns a new [PageEmployeeListResponseDto] instance.
  PageEmployeeListResponseDto({
    this.totalElements,
    this.totalPages,
    this.size,
    this.content = const [],
    this.number,
    this.pageable,
    this.sort,
    this.numberOfElements,
    this.first,
    this.last,
    this.empty,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? totalElements;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? totalPages;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? size;

  final List<EmployeeListResponseDto> content;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final int? number;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final PageableObject? pageable;

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
  final int? numberOfElements;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? first;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? last;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final bool? empty;

  /// The factory instance for creating [PageEmployeeListResponseDto] from JSON.
  static const factory = PageEmployeeListResponseDtoFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is PageEmployeeListResponseDto &&
    other.totalElements == totalElements &&
    other.totalPages == totalPages &&
    other.size == size &&
    other.content == content &&
    other.number == number &&
    other.pageable == pageable &&
    other.sort == sort &&
    other.numberOfElements == numberOfElements &&
    other.first == first &&
    other.last == last &&
    other.empty == empty;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (totalElements == null ? 0 : totalElements!.hashCode) +
    (totalPages == null ? 0 : totalPages!.hashCode) +
    (size == null ? 0 : size!.hashCode) +
    (content.hashCode) +
    (number == null ? 0 : number!.hashCode) +
    (pageable == null ? 0 : pageable!.hashCode) +
    (sort == null ? 0 : sort!.hashCode) +
    (numberOfElements == null ? 0 : numberOfElements!.hashCode) +
    (first == null ? 0 : first!.hashCode) +
    (last == null ? 0 : last!.hashCode) +
    (empty == null ? 0 : empty!.hashCode);

  @override
  String toString() => 'PageEmployeeListResponseDto[totalElements=$totalElements, totalPages=$totalPages, size=$size, content=$content, number=$number, pageable=$pageable, sort=$sort, numberOfElements=$numberOfElements, first=$first, last=$last, empty=$empty]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.totalElements != null) {
      json[r'totalElements'] = this.totalElements;
    } else {
      json[r'totalElements'] = null;
    }
    if (this.totalPages != null) {
      json[r'totalPages'] = this.totalPages;
    } else {
      json[r'totalPages'] = null;
    }
    if (this.size != null) {
      json[r'size'] = this.size;
    } else {
      json[r'size'] = null;
    }
      json[r'content'] = this.content;
    if (this.number != null) {
      json[r'number'] = this.number;
    } else {
      json[r'number'] = null;
    }
    if (this.pageable != null) {
      json[r'pageable'] = this.pageable;
    } else {
      json[r'pageable'] = null;
    }
    if (this.sort != null) {
      json[r'sort'] = this.sort;
    } else {
      json[r'sort'] = null;
    }
    if (this.numberOfElements != null) {
      json[r'numberOfElements'] = this.numberOfElements;
    } else {
      json[r'numberOfElements'] = null;
    }
    if (this.first != null) {
      json[r'first'] = this.first;
    } else {
      json[r'first'] = null;
    }
    if (this.last != null) {
      json[r'last'] = this.last;
    } else {
      json[r'last'] = null;
    }
    if (this.empty != null) {
      json[r'empty'] = this.empty;
    } else {
      json[r'empty'] = null;
    }
    return json;
  }

  /// Returns a new [PageEmployeeListResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PageEmployeeListResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "PageEmployeeListResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "PageEmployeeListResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PageEmployeeListResponseDto(
        totalElements: json[r'totalElements'] is int ? json[r'totalElements'] as int : null,
        totalPages: json[r'totalPages'] is int ? json[r'totalPages'] as int : null,
        size: json[r'size'] is int ? json[r'size'] as int : null,
        content: EmployeeListResponseDto.listFromJson(json[r'content']),
        number: json[r'number'] is int ? json[r'number'] as int : null,
        pageable: PageableObject.fromJson(json[r'pageable']),
        sort: SortObject.fromJson(json[r'sort']),
        numberOfElements: json[r'numberOfElements'] is int ? json[r'numberOfElements'] as int : null,
        first: json[r'first'] is bool ? json[r'first'] as bool : null,
        last: json[r'last'] is bool ? json[r'last'] as bool : null,
        empty: json[r'empty'] is bool ? json[r'empty'] as bool : null,
      );
    }
    return null;
  }

  static List<PageEmployeeListResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PageEmployeeListResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PageEmployeeListResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PageEmployeeListResponseDto> mapFromJson(dynamic json) {
    final map = <String, PageEmployeeListResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PageEmployeeListResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PageEmployeeListResponseDto-objects as value to a dart map
  static Map<String, List<PageEmployeeListResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PageEmployeeListResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PageEmployeeListResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [PageEmployeeListResponseDto] instances from JSON data.
class PageEmployeeListResponseDtoFactory extends JsonSchemaFactory<PageEmployeeListResponseDto> {
  const PageEmployeeListResponseDtoFactory();

  @override
  PageEmployeeListResponseDto fromJson(dynamic json) => PageEmployeeListResponseDto.fromJson(json)!;
}

