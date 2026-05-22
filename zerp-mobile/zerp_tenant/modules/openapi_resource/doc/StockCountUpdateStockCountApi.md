# openapi_resource.api.StockCountUpdateStockCountApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateStockCount**](StockCountUpdateStockCountApi.md#) | **PUT** /resource/stock-counts/{id} | Update: Update an existing entity


# **updateStockCount**
> ApiResponseStockCountDTO updateStockCount(id, stockCountUpdateDTO)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockCountUpdateStockCountApi();
final id = 1; // String | Unique identifier of the entity to update
final stockCountUpdateDTO = StockCountUpdateDTO(); // StockCountUpdateDTO | 

try {
    final result = api_instance.updateStockCount(id, stockCountUpdateDTO);
    print(result);
} catch (e) {
    print('Exception when calling StockCountUpdateStockCountApi->updateStockCount: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **stockCountUpdateDTO** | [**StockCountUpdateDTO**](StockCountUpdateDTO.md)|  | 

### Return type

[**ApiResponseStockCountDTO**](ApiResponseStockCountDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

