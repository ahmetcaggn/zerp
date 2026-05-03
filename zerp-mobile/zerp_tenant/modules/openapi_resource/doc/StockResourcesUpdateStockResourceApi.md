# openapi_resource.api.StockResourcesUpdateStockResourceApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *http://192.168.0.106:8084*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateStockResource**](StockResourcesUpdateStockResourceApi.md#) | **PUT** /{id} | Update: Update an existing entity


# **updateStockResource**
> ApiResponseStockResourceDTO updateStockResource(id, stockResourceUpdateDTO)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockResourcesUpdateStockResourceApi();
final id = 1; // String | Unique identifier of the entity to update
final stockResourceUpdateDTO = StockResourceUpdateDTO(); // StockResourceUpdateDTO | 

try {
    final result = api_instance.updateStockResource(id, stockResourceUpdateDTO);
    print(result);
} catch (e) {
    print('Exception when calling StockResourcesUpdateStockResourceApi->updateStockResource: $e\n');
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

