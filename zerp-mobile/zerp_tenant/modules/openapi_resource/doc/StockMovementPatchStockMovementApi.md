# openapi_resource.api.StockMovementPatchStockMovementApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**patchStockMovement**](StockMovementPatchStockMovementApi.md#) | **PATCH** /resource/stock-movements/{id} | Update: Update an existing entity


# **patchStockMovement**
> ApiResponseStockMovementDTO patchStockMovement(id, requestBody)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockMovementPatchStockMovementApi();
final id = 1; // String | Unique identifier of the entity to update
final requestBody = Map<String, Object>(); // Map<String, Object> | 

try {
    final result = api_instance.patchStockMovement(id, requestBody);
    print(result);
} catch (e) {
    print('Exception when calling StockMovementPatchStockMovementApi->patchStockMovement: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **requestBody** | [**Map<String, Object>**](Object.md)|  | 

### Return type

[**ApiResponseStockMovementDTO**](ApiResponseStockMovementDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

