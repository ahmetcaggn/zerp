//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'employee_list_response_dto.dart';
import 'pageable_object.dart';
import 'sort_object.dart';


part 'page_employee_list_response_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
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
    this.first,
    this.last,
    this.numberOfElements,
    this.empty,
  });

  @JsonKey(name: r'totalElements')
  final int? totalElements;

  @JsonKey(name: r'totalPages')
  final int? totalPages;

  @JsonKey(name: r'size')
  final int? size;

  @JsonKey(name: r'content')
  final List<EmployeeListResponseDto> content;

  @JsonKey(name: r'number')
  final int? number;

  @JsonKey(name: r'pageable')
  final PageableObject? pageable;

  @JsonKey(name: r'sort')
  final SortObject? sort;

  @JsonKey(name: r'first')
  final bool? first;

  @JsonKey(name: r'last')
  final bool? last;

  @JsonKey(name: r'numberOfElements')
  final int? numberOfElements;

  @JsonKey(name: r'empty')
  final bool? empty;

  /// The factory instance for creating [PageEmployeeListResponseDto] from JSON.
  static const factory = PageEmployeeListResponseDtoFactory();

  factory PageEmployeeListResponseDto.fromJson(Map<String, dynamic> json) => _$PageEmployeeListResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$PageEmployeeListResponseDtoToJson(this);

  static List<PageEmployeeListResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PageEmployeeListResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PageEmployeeListResponseDto.fromJson(row as Map<String, dynamic>);
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
        final value = PageEmployeeListResponseDto.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class PageEmployeeListResponseDtoFactory extends JsonSchemaFactory<PageEmployeeListResponseDto> {
  const PageEmployeeListResponseDtoFactory();

  @override
  PageEmployeeListResponseDto fromJson(dynamic json) => PageEmployeeListResponseDto.fromJson(json as Map<String, dynamic>);
}




