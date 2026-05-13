//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'stock_count_item_update_dto.dart';


part 'stock_count_update_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockCountUpdateDTO extends Schema {
  /// Returns a new [StockCountUpdateDTO] instance.
  StockCountUpdateDTO({
    this.status,
    this.countDate,
    this.notes,
    this.items = const [],
  });

  @JsonKey(name: r'status')
  final StockCountUpdateDTOStatusEnum? status;

  @JsonKey(name: r'countDate')
  final DateTime? countDate;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'items')
  final List<StockCountItemUpdateDTO> items;

  /// The factory instance for creating [StockCountUpdateDTO] from JSON.
  static const factory = StockCountUpdateDTOFactory();

  factory StockCountUpdateDTO.fromJson(Map<String, dynamic> json) => _$StockCountUpdateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockCountUpdateDTOToJson(this);

  static List<StockCountUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountUpdateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountUpdateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockCountUpdateDTOFactory extends JsonSchemaFactory<StockCountUpdateDTO> {
  const StockCountUpdateDTOFactory();

  @override
  StockCountUpdateDTO fromJson(dynamic json) => StockCountUpdateDTO.fromJson(json as Map<String, dynamic>);
}



enum StockCountUpdateDTOStatusEnum {
@JsonValue('DRAFT')
DRAFT('DRAFT'),
@JsonValue('IN_PROGRESS')
IN_PROGRESS('IN_PROGRESS'),
@JsonValue('COMPLETED')
COMPLETED('COMPLETED');

const StockCountUpdateDTOStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




