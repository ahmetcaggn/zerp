//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'stock_operation_item_dto.dart';


part 'stock_operation_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class StockOperationDTO extends Schema {
  /// Returns a new [StockOperationDTO] instance.
  StockOperationDTO({
    this.id,
    this.shopId,
    this.shopName,
    this.operationType,
    this.status,
    this.referenceNo,
    this.notes,
    this.itemCount,
    this.createdAt,
    this.tenantId,
    this.items = const [],
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'shopId')
  final String? shopId;

  @JsonKey(name: r'shopName')
  final String? shopName;

  @JsonKey(name: r'operationType')
  final StockOperationDTOOperationTypeEnum? operationType;

  @JsonKey(name: r'status')
  final StockOperationDTOStatusEnum? status;

  @JsonKey(name: r'referenceNo')
  final String? referenceNo;

  @JsonKey(name: r'notes')
  final String? notes;

  @JsonKey(name: r'itemCount')
  final int? itemCount;

  @JsonKey(name: r'createdAt')
  final DateTime? createdAt;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  @JsonKey(name: r'items')
  final List<StockOperationItemDTO> items;

  /// The factory instance for creating [StockOperationDTO] from JSON.
  static const factory = StockOperationDTOFactory();

  factory StockOperationDTO.fromJson(Map<String, dynamic> json) => _$StockOperationDTOFromJson(json);

  Map<String, dynamic> toJson() => _$StockOperationDTOToJson(this);

  static List<StockOperationDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StockOperationDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StockOperationDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StockOperationDTO> mapFromJson(dynamic json) {
    final map = <String, StockOperationDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StockOperationDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class StockOperationDTOFactory extends JsonSchemaFactory<StockOperationDTO> {
  const StockOperationDTOFactory();

  @override
  StockOperationDTO fromJson(dynamic json) => StockOperationDTO.fromJson(json as Map<String, dynamic>);
}



enum StockOperationDTOOperationTypeEnum {
@JsonValue('ENTRY')
ENTRY('ENTRY'),
@JsonValue('ADJUSTMENT')
ADJUSTMENT('ADJUSTMENT');

const StockOperationDTOOperationTypeEnum(this.value);

final String value;

@override
String toString() => value;
}



enum StockOperationDTOStatusEnum {
@JsonValue('DRAFT')
DRAFT('DRAFT'),
@JsonValue('POSTED')
POSTED('POSTED'),
@JsonValue('CANCELLED')
CANCELLED('CANCELLED');

const StockOperationDTOStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




