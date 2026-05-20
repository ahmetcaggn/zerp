//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'table_order_item_selected_extra_option_dto.dart';


part 'table_order_item_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderItemDTO extends Schema {
  /// Returns a new [TableOrderItemDTO] instance.
  TableOrderItemDTO({
    this.id,
    this.menuItemId,
    this.menuItemName,
    this.quantity,
    this.unitPrice,
    this.notes,
    this.selectedExtraOptions = const [],
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'menuItemId')
  final String? menuItemId;

  @JsonKey(name: r'menuItemName')
  final String? menuItemName;

  @JsonKey(name: r'quantity')
  final int? quantity;

  @JsonKey(name: r'unitPrice')
  final num? unitPrice;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'selectedExtraOptions')
  final List<TableOrderItemSelectedExtraOptionDTO> selectedExtraOptions;

  /// The factory instance for creating [TableOrderItemDTO] from JSON.
  static const factory = TableOrderItemDTOFactory();

  factory TableOrderItemDTO.fromJson(Map<String, dynamic> json) => _$TableOrderItemDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderItemDTOToJson(this);

  static List<TableOrderItemDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderItemDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderItemDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderItemDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderItemDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderItemDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderItemDTOFactory extends JsonSchemaFactory<TableOrderItemDTO> {
  const TableOrderItemDTOFactory();

  @override
  TableOrderItemDTO fromJson(dynamic json) => TableOrderItemDTO.fromJson(json as Map<String, dynamic>);
}




