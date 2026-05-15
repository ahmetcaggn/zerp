# openapi_sale.api.TableOrderUpdateTableOrderApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateTableOrder**](TableOrderUpdateTableOrderApi.md#) | **PUT** /sale/table-orders/{id} | Update: Update an existing entity


# **updateTableOrder**
> ApiResponseTableOrderDTO updateTableOrder(id, tableOrderUpdateDTO)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = TableOrderUpdateTableOrderApi();
final id = 1; // String | Unique identifier of the entity to update
final tableOrderUpdateDTO = TableOrderUpdateDTO(); // TableOrderUpdateDTO | 

try {
    final result = api_instance.updateTableOrder(id, tableOrderUpdateDTO);
    print(result);
} catch (e) {
    print('Exception when calling TableOrderUpdateTableOrderApi->updateTableOrder: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **tableOrderUpdateDTO** | [**TableOrderUpdateDTO**](TableOrderUpdateDTO.md)|  | 

### Return type

[**ApiResponseTableOrderDTO**](ApiResponseTableOrderDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

