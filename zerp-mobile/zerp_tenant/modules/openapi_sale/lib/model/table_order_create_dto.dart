//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'table_order_item_create_dto.dart';


part 'table_order_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderCreateDTO extends Schema {
  /// Returns a new [TableOrderCreateDTO] instance.
  TableOrderCreateDTO({
    this.tableId,
    this.note,
    this.items = const [],
  });

  @JsonKey(name: r'tableId')
  final String? tableId;

  @JsonKey(name: r'note')
  final String? note;

  @JsonKey(name: r'items')
  final List<TableOrderItemCreateDTO> items;

  /// The factory instance for creating [TableOrderCreateDTO] from JSON.
  static const factory = TableOrderCreateDTOFactory();

  factory TableOrderCreateDTO.fromJson(Map<String, dynamic> json) => _$TableOrderCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderCreateDTOToJson(this);

  static List<TableOrderCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderCreateDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderCreateDTOFactory extends JsonSchemaFactory<TableOrderCreateDTO> {
  const TableOrderCreateDTOFactory();

  @override
  TableOrderCreateDTO fromJson(dynamic json) => TableOrderCreateDTO.fromJson(json as Map<String, dynamic>);
}




