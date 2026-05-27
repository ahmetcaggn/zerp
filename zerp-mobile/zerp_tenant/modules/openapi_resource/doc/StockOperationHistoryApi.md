# openapi_resource.api.StockOperationHistoryApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**history**](StockOperationHistoryApi.md#) | **GET** /resource/stock-operations/history | 


# **history**
> ApiResponseListStockOperationDTO history(shopId, operationType, from, to, referenceNo, limit)



### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockOperationHistoryApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final operationType = operationType_example; // String | 
final from = 2013-10-20T19:20:30+01:00; // DateTime | 
final to = 2013-10-20T19:20:30+01:00; // DateTime | 
final referenceNo = referenceNo_example; // String | 
final limit = 56; // int | 

try {
    final result = api_instance.history(shopId, operationType, from, to, referenceNo, limit);
    print(result);
} catch (e) {
    print('Exception when calling StockOperationHistoryApi->history: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 
 **operationType** | **String**|  | [optional] 
 **from** | **DateTime**|  | [optional] 
 **to** | **DateTime**|  | [optional] 
 **referenceNo** | **String**|  | [optional] 
 **limit** | **int**|  | [optional] 

### Return type

[**ApiResponseListStockOperationDTO**](ApiResponseListStockOperationDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

