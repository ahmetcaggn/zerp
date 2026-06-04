//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'table_order_item_dto.dart';
import 'table_order_payment_dto.dart';


part 'table_order_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderDTO extends Schema {
  /// Returns a new [TableOrderDTO] instance.
  TableOrderDTO({
    this.id,
    this.shopTableId,
    this.shopTableName,
    this.shopId,
    this.shopName,
    this.status,
    this.note,
    this.items = const [],
    this.payments = const [],
    this.createdAt,
    this.updatedAt,
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'shopTableId')
  final String? shopTableId;

  @JsonKey(name: r'shopTableName')
  final String? shopTableName;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'shopName')
  final String? shopName;

  @JsonKey(name: r'status')
  final TableOrderDTOStatusEnum? status;

  @JsonKey(name: r'note')
  final String? note;

  @JsonKey(name: r'items')
  final List<TableOrderItemDTO> items;

  @JsonKey(name: r'payments')
  final List<TableOrderPaymentDTO> payments;

  @JsonKey(name: r'createdAt')
  final DateTime? createdAt;

  @JsonKey(name: r'updatedAt')
  final DateTime? updatedAt;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [TableOrderDTO] from JSON.
  static const factory = TableOrderDTOFactory();

  factory TableOrderDTO.fromJson(Map<String, dynamic> json) => _$TableOrderDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderDTOToJson(this);

  static List<TableOrderDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderDTOFactory extends JsonSchemaFactory<TableOrderDTO> {
  const TableOrderDTOFactory();

  @override
  TableOrderDTO fromJson(dynamic json) => TableOrderDTO.fromJson(json as Map<String, dynamic>);
}



enum TableOrderDTOStatusEnum {
@JsonValue('OPEN')
OPEN('OPEN'),
@JsonValue('PAID')
PAID('PAID'),
@JsonValue('CANCELLED')
CANCELLED('CANCELLED');

const TableOrderDTOStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




