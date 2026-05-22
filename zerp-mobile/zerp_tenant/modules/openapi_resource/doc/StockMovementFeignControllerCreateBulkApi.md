# openapi_resource.api.StockMovementFeignControllerCreateBulkApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createBulk**](StockMovementFeignControllerCreateBulkApi.md#) | **POST** /feign/resource/stock-movements/bulk | 


# **createBulk**
> createBulk(stockMovementFeignRequest)



### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockMovementFeignControllerCreateBulkApi();
final stockMovementFeignRequest = [List<StockMovementFeignRequest>()]; // List<StockMovementFeignRequest> | 

try {
    api_instance.createBulk(stockMovementFeignRequest);
} catch (e) {
    print('Exception when calling StockMovementFeignControllerCreateBulkApi->createBulk: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **stockMovementFeignRequest** | [**List<StockMovementFeignRequest>**](StockMovementFeignRequest.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

