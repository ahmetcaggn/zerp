# openapi_sale.api.ShopTableUpdateShopTableApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateShopTable**](ShopTableUpdateShopTableApi.md#) | **PUT** /sale/tables/{id} | Update: Update an existing entity


# **updateShopTable**
> ApiResponseShopTableDTO updateShopTable(id, shopTableUpdateDTO)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ShopTableUpdateShopTableApi();
final id = 1; // String | Unique identifier of the entity to update
final shopTableUpdateDTO = ShopTableUpdateDTO(); // ShopTableUpdateDTO | 

try {
    final result = api_instance.updateShopTable(id, shopTableUpdateDTO);
    print(result);
} catch (e) {
    print('Exception when calling ShopTableUpdateShopTableApi->updateShopTable: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **shopTableUpdateDTO** | [**ShopTableUpdateDTO**](ShopTableUpdateDTO.md)|  | 

### Return type

[**ApiResponseShopTableDTO**](ApiResponseShopTableDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

