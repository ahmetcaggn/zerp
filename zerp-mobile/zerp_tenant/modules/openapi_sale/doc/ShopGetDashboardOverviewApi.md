# openapi_sale.api.ShopGetDashboardOverviewApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getDashboardOverview**](ShopGetDashboardOverviewApi.md#) | **GET** /sale/shops/{shopId}/dashboard-overview | 


# **getDashboardOverview**
> ShopDashboardOverviewDTO getDashboardOverview(shopId)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ShopGetDashboardOverviewApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.getDashboardOverview(shopId);
    print(result);
} catch (e) {
    print('Exception when calling ShopGetDashboardOverviewApi->getDashboardOverview: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 

### Return type

[**ShopDashboardOverviewDTO**](ShopDashboardOverviewDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

