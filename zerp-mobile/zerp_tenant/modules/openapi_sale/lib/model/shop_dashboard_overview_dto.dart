//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'shop_dashboard_category_sales_dto.dart';
import 'shop_dashboard_low_stock_dto.dart';
import 'shop_dashboard_performance_dto.dart';
import 'shop_dashboard_sales_channel_dto.dart';
import 'shop_dashboard_top_product_dto.dart';
import 'shop_dashboard_trend_point_dto.dart';


part 'shop_dashboard_overview_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopDashboardOverviewDTO extends Schema {
  /// Returns a new [ShopDashboardOverviewDTO] instance.
  ShopDashboardOverviewDTO({
    this.dailyRevenue,
    this.averageCheck,
    this.activeTableCount,
    this.totalTableCount,
    this.trend = const [],
    this.salesChannels = const [],
    this.categorySales = const [],
    this.topProducts = const [],
    this.performance,
    this.lowStock = const [],
    this.lastUpdatedAt,
  });

  @JsonKey(name: r'dailyRevenue')
  final num? dailyRevenue;

  @JsonKey(name: r'averageCheck')
  final num? averageCheck;

  @JsonKey(name: r'activeTableCount')
  final int? activeTableCount;

  @JsonKey(name: r'totalTableCount')
  final int? totalTableCount;

  @JsonKey(name: r'trend')
  final List<ShopDashboardTrendPointDTO> trend;

  @JsonKey(name: r'salesChannels')
  final List<ShopDashboardSalesChannelDTO> salesChannels;

  @JsonKey(name: r'categorySales')
  final List<ShopDashboardCategorySalesDTO> categorySales;

  @JsonKey(name: r'topProducts')
  final List<ShopDashboardTopProductDTO> topProducts;

  @JsonKey(name: r'performance')
  final ShopDashboardPerformanceDTO? performance;

  @JsonKey(name: r'lowStock')
  final List<ShopDashboardLowStockDTO> lowStock;

  @JsonKey(name: r'lastUpdatedAt')
  final DateTime? lastUpdatedAt;

  /// The factory instance for creating [ShopDashboardOverviewDTO] from JSON.
  static const factory = ShopDashboardOverviewDTOFactory();

  factory ShopDashboardOverviewDTO.fromJson(Map<String, dynamic> json) => _$ShopDashboardOverviewDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopDashboardOverviewDTOToJson(this);

  static List<ShopDashboardOverviewDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopDashboardOverviewDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopDashboardOverviewDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopDashboardOverviewDTO> mapFromJson(dynamic json) {
    final map = <String, ShopDashboardOverviewDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopDashboardOverviewDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopDashboardOverviewDTOFactory extends JsonSchemaFactory<ShopDashboardOverviewDTO> {
  const ShopDashboardOverviewDTOFactory();

  @override
  ShopDashboardOverviewDTO fromJson(dynamic json) => ShopDashboardOverviewDTO.fromJson(json as Map<String, dynamic>);
}




