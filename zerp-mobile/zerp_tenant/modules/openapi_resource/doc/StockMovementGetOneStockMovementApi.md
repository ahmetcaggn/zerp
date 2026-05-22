# openapi_resource.api.StockMovementGetOneStockMovementApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getOneStockMovement**](StockMovementGetOneStockMovementApi.md#) | **GET** /resource/stock-movements/{id} | GetOne: Get single entity by ID


# **getOneStockMovement**
> ApiResponseStockMovementDTO getOneStockMovement(id)

GetOne: Get single entity by ID

Retrieves a single entity by its unique identifier. Implements ra-spring-data-provider's getOne operation. 

### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockMovementGetOneStockMovementApi();
final id = 1; // String | Unique identifier of the entity to retrieve

try {
    final result = api_instance.getOneStockMovement(id);
    print(result);
} catch (e) {
    print('Exception when calling StockMovementGetOneStockMovementApi->getOneStockMovement: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to retrieve | 

### Return type

[**ApiResponseStockMovementDTO**](ApiResponseStockMovementDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

