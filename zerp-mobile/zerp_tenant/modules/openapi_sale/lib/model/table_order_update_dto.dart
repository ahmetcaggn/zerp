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
import 'table_order_payment_create_dto.dart';


part 'table_order_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderUpdateDTO extends Schema {
  /// Returns a new [TableOrderUpdateDTO] instance.
  TableOrderUpdateDTO({
    this.status,
    this.note,
    this.items = const [],
    this.payments = const [],
  });

  @JsonKey(name: r'status')
  final TableOrderUpdateDTOStatusEnum? status;

  @JsonKey(name: r'note')
  final String? note;

  @JsonKey(name: r'items')
  final List<TableOrderItemCreateDTO> items;

  @JsonKey(name: r'payments')
  final List<TableOrderPaymentCreateDTO> payments;

  /// The factory instance for creating [TableOrderUpdateDTO] from JSON.
  static const factory = TableOrderUpdateDTOFactory();

  factory TableOrderUpdateDTO.fromJson(Map<String, dynamic> json) => _$TableOrderUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderUpdateDTOToJson(this);

  static List<TableOrderUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderUpdateDTOFactory extends JsonSchemaFactory<TableOrderUpdateDTO> {
  const TableOrderUpdateDTOFactory();

  @override
  TableOrderUpdateDTO fromJson(dynamic json) => TableOrderUpdateDTO.fromJson(json as Map<String, dynamic>);
}



enum TableOrderUpdateDTOStatusEnum {
@JsonValue('OPEN')
OPEN('OPEN'),
@JsonValue('PAID')
PAID('PAID'),
@JsonValue('CANCELLED')
CANCELLED('CANCELLED');

const TableOrderUpdateDTOStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




