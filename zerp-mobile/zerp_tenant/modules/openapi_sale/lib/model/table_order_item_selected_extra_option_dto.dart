//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'table_order_item_selected_extra_option_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderItemSelectedExtraOptionDTO extends Schema {
  /// Returns a new [TableOrderItemSelectedExtraOptionDTO] instance.
  TableOrderItemSelectedExtraOptionDTO({
    this.extraOptionId,
    this.name,
    this.price,
  });

  @JsonKey(name: r'extraOptionId')
  final String? extraOptionId;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'price')
  final num? price;

  /// The factory instance for creating [TableOrderItemSelectedExtraOptionDTO] from JSON.
  static const factory = TableOrderItemSelectedExtraOptionDTOFactory();

  factory TableOrderItemSelectedExtraOptionDTO.fromJson(Map<String, dynamic> json) => _$TableOrderItemSelectedExtraOptionDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderItemSelectedExtraOptionDTOToJson(this);

  static List<TableOrderItemSelectedExtraOptionDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderItemSelectedExtraOptionDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderItemSelectedExtraOptionDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderItemSelectedExtraOptionDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderItemSelectedExtraOptionDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderItemSelectedExtraOptionDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderItemSelectedExtraOptionDTOFactory extends JsonSchemaFactory<TableOrderItemSelectedExtraOptionDTO> {
  const TableOrderItemSelectedExtraOptionDTOFactory();

  @override
  TableOrderItemSelectedExtraOptionDTO fromJson(dynamic json) => TableOrderItemSelectedExtraOptionDTO.fromJson(json as Map<String, dynamic>);
}




