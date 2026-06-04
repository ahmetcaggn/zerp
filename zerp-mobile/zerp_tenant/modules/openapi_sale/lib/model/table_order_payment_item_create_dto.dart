//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'table_order_payment_item_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderPaymentItemCreateDTO extends Schema {
  /// Returns a new [TableOrderPaymentItemCreateDTO] instance.
  TableOrderPaymentItemCreateDTO({
    this.tableOrderItemId,
    this.quantity,
  });

  @JsonKey(name: r'tableOrderItemId')
  final String? tableOrderItemId;

  @JsonKey(name: r'quantity')
  final int? quantity;

  /// The factory instance for creating [TableOrderPaymentItemCreateDTO] from JSON.
  static const factory = TableOrderPaymentItemCreateDTOFactory();

  factory TableOrderPaymentItemCreateDTO.fromJson(Map<String, dynamic> json) => _$TableOrderPaymentItemCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderPaymentItemCreateDTOToJson(this);

  static List<TableOrderPaymentItemCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderPaymentItemCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderPaymentItemCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderPaymentItemCreateDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderPaymentItemCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderPaymentItemCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderPaymentItemCreateDTOFactory extends JsonSchemaFactory<TableOrderPaymentItemCreateDTO> {
  const TableOrderPaymentItemCreateDTOFactory();

  @override
  TableOrderPaymentItemCreateDTO fromJson(dynamic json) => TableOrderPaymentItemCreateDTO.fromJson(json as Map<String, dynamic>);
}




