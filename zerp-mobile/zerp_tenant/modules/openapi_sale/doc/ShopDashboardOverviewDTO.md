# openapi_sale.model.ShopDashboardOverviewDTO

## Load the model package
```dart
import 'package:openapi_sale/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dailyRevenue** | **num** |  | [optional] 
**averageCheck** | **num** |  | [optional] 
**activeTableCount** | **int** |  | [optional] 
**totalTableCount** | **int** |  | [optional] 
**trend** | [**List<ShopDashboardTrendPointDTO>**](ShopDashboardTrendPointDTO.md) |  | [optional] [default to const []]
**salesChannels** | [**List<ShopDashboardSalesChannelDTO>**](ShopDashboardSalesChannelDTO.md) |  | [optional] [default to const []]
**categorySales** | [**List<ShopDashboardCategorySalesDTO>**](ShopDashboardCategorySalesDTO.md) |  | [optional] [default to const []]
**topProducts** | [**List<ShopDashboardTopProductDTO>**](ShopDashboardTopProductDTO.md) |  | [optional] [default to const []]
**performance** | [**ShopDashboardPerformanceDTO**](ShopDashboardPerformanceDTO.md) |  | [optional] 
**lowStock** | [**List<ShopDashboardLowStockDTO>**](ShopDashboardLowStockDTO.md) |  | [optional] [default to const []]
**lastUpdatedAt** | [**DateTime**](DateTime.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


