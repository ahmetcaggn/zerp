//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'stock_count_item_dto.dart';


part 'stock_count_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockCountDTO extends Schema {
  /// Returns a new [StockCountDTO] instance.
  StockCountDTO({
    this.id,
    this.shopId,
    this.shopName,
    this.status,
    this.countDate,
    this.notes,
    this.items = const [],
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'shopName')
  final String? shopName;

  @JsonKey(name: r'status')
  final StockCountDTOStatusEnum? status;

  @JsonKey(name: r'countDate')
  final DateTime? countDate;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'items')
  final List<StockCountItemDTO> items;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [StockCountDTO] from JSON.
  static const factory = StockCountDTOFactory();

  factory StockCountDTO.fromJson(Map<String, dynamic> json) => _$StockCountDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockCountDTOToJson(this);

  static List<StockCountDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockCountDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockCountDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockCountDTO> mapFromJson(dynamic json) {
    final map = <String, StockCountDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockCountDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockCountDTOFactory extends JsonSchemaFactory<StockCountDTO> {
  const StockCountDTOFactory();

  @override
  StockCountDTO fromJson(dynamic json) => StockCountDTO.fromJson(json as Map<String, dynamic>);
}



enum StockCountDTOStatusEnum {
@JsonValue(r'DRAFT')
DRAFT(r'DRAFT'),
@JsonValue(r'IN_PROGRESS')
IN_PROGRESS(r'IN_PROGRESS'),
@JsonValue(r'COMPLETED')
COMPLETED(r'COMPLETED');

const StockCountDTOStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




