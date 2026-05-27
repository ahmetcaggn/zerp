# openapi_resource.api.StockResourceOverviewApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**overview**](StockResourceOverviewApi.md#) | **GET** /resource/stock-resources/overview | 


# **overview**
> ApiResponseListStockOverviewDTO overview(shopId)



### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockResourceOverviewApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.overview(shopId);
    print(result);
} catch (e) {
    print('Exception when calling StockResourceOverviewApi->overview: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 

### Return type

[**ApiResponseListStockOverviewDTO**](ApiResponseListStockOverviewDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

