# openapi_resource.api.StockMovementDrillDownApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**drillDown**](StockMovementDrillDownApi.md#) | **GET** /resource/stock-movements/drill-down | 


# **drillDown**
> ApiResponseListStockMovementDTO drillDown(shopId, from, to, stockResourceId, limit)



### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockMovementDrillDownApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final from = 2013-10-20T19:20:30+01:00; // DateTime | 
final to = 2013-10-20T19:20:30+01:00; // DateTime | 
final stockResourceId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final limit = 56; // int | 

try {
    final result = api_instance.drillDown(shopId, from, to, stockResourceId, limit);
    print(result);
} catch (e) {
    print('Exception when calling StockMovementDrillDownApi->drillDown: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 
 **from** | **DateTime**|  | 
 **to** | **DateTime**|  | 
 **stockResourceId** | **String**|  | [optional] 
 **limit** | **int**|  | [optional] [default to 250]

### Return type

[**ApiResponseListStockMovementDTO**](ApiResponseListStockMovementDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

