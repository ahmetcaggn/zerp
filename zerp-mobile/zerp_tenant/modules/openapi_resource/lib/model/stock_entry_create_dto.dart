//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'stock_entry_item_dto.dart';


part 'stock_entry_create_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockEntryCreateDTO extends Schema {
  /// Returns a new [StockEntryCreateDTO] instance.
  StockEntryCreateDTO({
    this.shopId,
    this.referenceNo,
    this.notes,
    this.items = const [],
  });

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'referenceNo')
  final String? referenceNo;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'items')
  final List<StockEntryItemDTO> items;

  /// The factory instance for creating [StockEntryCreateDTO] from JSON.
  static const factory = StockEntryCreateDTOFactory();

  factory StockEntryCreateDTO.fromJson(Map<String, dynamic> json) => _$StockEntryCreateDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockEntryCreateDTOToJson(this);

  static List<StockEntryCreateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockEntryCreateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockEntryCreateDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockEntryCreateDTO> mapFromJson(dynamic json) {
    final map = <String, StockEntryCreateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockEntryCreateDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockEntryCreateDTOFactory extends JsonSchemaFactory<StockEntryCreateDTO> {
  const StockEntryCreateDTOFactory();

  @override
  StockEntryCreateDTO fromJson(dynamic json) => StockEntryCreateDTO.fromJson(json as Map<String, dynamic>);
}




