# openapi_sale.model.TenantDashboardOverviewDTO

## Load the model package
```dart
import 'package:openapi_sale/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalSales** | **num** |  | [optional] 
**averageBasket** | **num** |  | [optional] 
**totalOrders** | **int** |  | [optional] 
**totalStores** | **int** |  | [optional] 
**metricsDelta** | [**TenantDashboardMetricsDeltaDTO**](TenantDashboardMetricsDeltaDTO.md) |  | [optional] 
**trend** | [**List<TenantDashboardTrendPointDTO>**](TenantDashboardTrendPointDTO.md) |  | [optional] [default to const []]
**cityDistribution** | [**List<TenantDashboardCityDistributionDTO>**](TenantDashboardCityDistributionDTO.md) |  | [optional] [default to const []]
**storePerformance** | [**List<TenantDashboardStorePerformanceDTO>**](TenantDashboardStorePerformanceDTO.md) |  | [optional] [default to const []]
**summary** | [**TenantDashboardSummaryDTO**](TenantDashboardSummaryDTO.md) |  | [optional] 
**lastUpdatedAt** | [**DateTime**](DateTime.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


