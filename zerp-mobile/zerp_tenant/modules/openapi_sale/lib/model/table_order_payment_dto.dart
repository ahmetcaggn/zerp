//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'table_order_payment_item_dto.dart';


part 'table_order_payment_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderPaymentDTO extends Schema {
  /// Returns a new [TableOrderPaymentDTO] instance.
  TableOrderPaymentDTO({
    this.id,
    this.method,
    this.amount,
    this.paidAt,
    this.items = const [],
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'method')
  final TableOrderPaymentDTOMethodEnum? method;

  @JsonKey(name: r'amount')
  final num? amount;

  @JsonKey(name: r'paidAt')
  final DateTime? paidAt;

  @JsonKey(name: r'items')
  final List<TableOrderPaymentItemDTO> items;

  /// The factory instance for creating [TableOrderPaymentDTO] from JSON.
  static const factory = TableOrderPaymentDTOFactory();

  factory TableOrderPaymentDTO.fromJson(Map<String, dynamic> json) => _$TableOrderPaymentDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderPaymentDTOToJson(this);

  static List<TableOrderPaymentDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderPaymentDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderPaymentDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderPaymentDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderPaymentDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderPaymentDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderPaymentDTOFactory extends JsonSchemaFactory<TableOrderPaymentDTO> {
  const TableOrderPaymentDTOFactory();

  @override
  TableOrderPaymentDTO fromJson(dynamic json) => TableOrderPaymentDTO.fromJson(json as Map<String, dynamic>);
}



enum TableOrderPaymentDTOMethodEnum {
@JsonValue('CASH')
CASH('CASH');

const TableOrderPaymentDTOMethodEnum(this.value);

final String value;

@override
String toString() => value;
}




