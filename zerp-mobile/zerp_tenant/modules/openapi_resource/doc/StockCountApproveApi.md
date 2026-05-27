# openapi_resource.api.StockCountApproveApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**approve**](StockCountApproveApi.md#) | **POST** /resource/stock-counts/{id}/approve | 


# **approve**
> ApiResponseStockCountDTO approve(id)



### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockCountApproveApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.approve(id);
    print(result);
} catch (e) {
    print('Exception when calling StockCountApproveApi->approve: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**ApiResponseStockCountDTO**](ApiResponseStockCountDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

