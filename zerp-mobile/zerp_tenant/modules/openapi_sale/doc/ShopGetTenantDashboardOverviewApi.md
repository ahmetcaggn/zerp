# openapi_sale.api.ShopGetTenantDashboardOverviewApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTenantDashboardOverview**](ShopGetTenantDashboardOverviewApi.md#) | **GET** /sale/shops/dashboard-overview | 


# **getTenantDashboardOverview**
> TenantDashboardOverviewDTO getTenantDashboardOverview()



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ShopGetTenantDashboardOverviewApi();

try {
    final result = api_instance.getTenantDashboardOverview();
    print(result);
} catch (e) {
    print('Exception when calling ShopGetTenantDashboardOverviewApi->getTenantDashboardOverview: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**TenantDashboardOverviewDTO**](TenantDashboardOverviewDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

