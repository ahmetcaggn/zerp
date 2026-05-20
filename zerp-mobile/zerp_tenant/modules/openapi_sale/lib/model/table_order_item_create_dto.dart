//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'table_order_item_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderItemCreateDTO extends Schema {
  /// Returns a new [TableOrderItemCreateDTO] instance.
  TableOrderItemCreateDTO({
    this.menuItemId,
    this.quantity,
    this.notes,
    this.selectedExtraOptionIds = const [],
  });

  @JsonKey(name: r'menuItemId')
  final String? menuItemId;

  @JsonKey(name: r'quantity')
  final int? quantity;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'selectedExtraOptionIds')
  final List<String> selectedExtraOptionIds;

  /// The factory instance for creating [TableOrderItemCreateDTO] from JSON.
  static const factory = TableOrderItemCreateDTOFactory();

  factory TableOrderItemCreateDTO.fromJson(Map<String, dynamic> json) => _$TableOrderItemCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderItemCreateDTOToJson(this);

  static List<TableOrderItemCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderItemCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderItemCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderItemCreateDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderItemCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderItemCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderItemCreateDTOFactory extends JsonSchemaFactory<TableOrderItemCreateDTO> {
  const TableOrderItemCreateDTOFactory();

  @override
  TableOrderItemCreateDTO fromJson(dynamic json) => TableOrderItemCreateDTO.fromJson(json as Map<String, dynamic>);
}




