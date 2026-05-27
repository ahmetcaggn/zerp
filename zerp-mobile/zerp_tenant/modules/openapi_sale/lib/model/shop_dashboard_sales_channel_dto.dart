//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_dashboard_sales_channel_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopDashboardSalesChannelDTO extends Schema {
  /// Returns a new [ShopDashboardSalesChannelDTO] instance.
  ShopDashboardSalesChannelDTO({
    this.channelId,
    this.value,
    this.percentage,
  });

  @JsonKey(name: r'channelId')
  final String? channelId;

  @JsonKey(name: r'value')
  final int? value;

  @JsonKey(name: r'percentage')
  final num? percentage;

  /// The factory instance for creating [ShopDashboardSalesChannelDTO] from JSON.
  static const factory = ShopDashboardSalesChannelDTOFactory();

  factory ShopDashboardSalesChannelDTO.fromJson(Map<String, dynamic> json) => _$ShopDashboardSalesChannelDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopDashboardSalesChannelDTOToJson(this);

  static List<ShopDashboardSalesChannelDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopDashboardSalesChannelDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopDashboardSalesChannelDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopDashboardSalesChannelDTO> mapFromJson(dynamic json) {
    final map = <String, ShopDashboardSalesChannelDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopDashboardSalesChannelDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopDashboardSalesChannelDTOFactory extends JsonSchemaFactory<ShopDashboardSalesChannelDTO> {
  const ShopDashboardSalesChannelDTOFactory();

  @override
  ShopDashboardSalesChannelDTO fromJson(dynamic json) => ShopDashboardSalesChannelDTO.fromJson(json as Map<String, dynamic>);
}




