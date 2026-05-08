# openapi_resource.api.StockResourceUpdateStockResourceApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateStockResource**](StockResourceUpdateStockResourceApi.md#) | **PUT** /resource/stock-resources/{id} | Update: Update an existing entity


# **updateStockResource**
> ApiResponseStockResourceDTO updateStockResource(id, stockResourceUpdateDTO)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockResourceUpdateStockResourceApi();
final id = 1; // String | Unique identifier of the entity to update
final stockResourceUpdateDTO = StockResourceUpdateDTO(); // StockResourceUpdateDTO | 

try {
    final result = api_instance.updateStockResource(id, stockResourceUpdateDTO);
    print(result);
} catch (e) {
    print('Exception when calling StockResourceUpdateStockResourceApi->updateStockResource: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **stockResourceUpdateDTO** | [**StockResourceUpdateDTO**](StockResourceUpdateDTO.md)|  | 

### Return type

[**ApiResponseStockResourceDTO**](ApiResponseStockResourceDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

