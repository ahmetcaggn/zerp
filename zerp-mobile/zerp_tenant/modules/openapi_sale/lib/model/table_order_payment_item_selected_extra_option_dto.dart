//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'table_order_payment_item_selected_extra_option_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TableOrderPaymentItemSelectedExtraOptionDTO extends Schema {
  /// Returns a new [TableOrderPaymentItemSelectedExtraOptionDTO] instance.
  TableOrderPaymentItemSelectedExtraOptionDTO({
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

  /// The factory instance for creating [TableOrderPaymentItemSelectedExtraOptionDTO] from JSON.
  static const factory = TableOrderPaymentItemSelectedExtraOptionDTOFactory();

  factory TableOrderPaymentItemSelectedExtraOptionDTO.fromJson(Map<String, dynamic> json) => _$TableOrderPaymentItemSelectedExtraOptionDTOFromJson(json);

  Map<String, dynamic> toJson() => _$TableOrderPaymentItemSelectedExtraOptionDTOToJson(this);

  static List<TableOrderPaymentItemSelectedExtraOptionDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TableOrderPaymentItemSelectedExtraOptionDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TableOrderPaymentItemSelectedExtraOptionDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TableOrderPaymentItemSelectedExtraOptionDTO> mapFromJson(dynamic json) {
    final map = <String, TableOrderPaymentItemSelectedExtraOptionDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TableOrderPaymentItemSelectedExtraOptionDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class TableOrderPaymentItemSelectedExtraOptionDTOFactory extends JsonSchemaFactory<TableOrderPaymentItemSelectedExtraOptionDTO> {
  const TableOrderPaymentItemSelectedExtraOptionDTOFactory();

  @override
  TableOrderPaymentItemSelectedExtraOptionDTO fromJson(dynamic json) => TableOrderPaymentItemSelectedExtraOptionDTO.fromJson(json as Map<String, dynamic>);
}




