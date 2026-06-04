//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'table_order_payment_item_create_dto.dart';


part 'table_order_payment_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderPaymentCreateDTO extends Schema {
  /// Returns a new [TableOrderPaymentCreateDTO] instance.
  TableOrderPaymentCreateDTO({
    this.method,
    this.amount,
    this.items = const [],
  });

  @JsonKey(name: r'method')
  final TableOrderPaymentCreateDTOMethodEnum? method;

  @JsonKey(name: r'amount')
  final num? amount;

  @JsonKey(name: r'items')
  final List<TableOrderPaymentItemCreateDTO> items;

  /// The factory instance for creating [TableOrderPaymentCreateDTO] from JSON.
  static const factory = TableOrderPaymentCreateDTOFactory();

  factory TableOrderPaymentCreateDTO.fromJson(Map<String, dynamic> json) => _$TableOrderPaymentCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderPaymentCreateDTOToJson(this);

  static List<TableOrderPaymentCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderPaymentCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderPaymentCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderPaymentCreateDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderPaymentCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderPaymentCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderPaymentCreateDTOFactory extends JsonSchemaFactory<TableOrderPaymentCreateDTO> {
  const TableOrderPaymentCreateDTOFactory();

  @override
  TableOrderPaymentCreateDTO fromJson(dynamic json) => TableOrderPaymentCreateDTO.fromJson(json as Map<String, dynamic>);
}



enum TableOrderPaymentCreateDTOMethodEnum {
@JsonValue('CASH')
CASH('CASH');

const TableOrderPaymentCreateDTOMethodEnum(this.value);

final String value;

@override
String toString() => value;
}




