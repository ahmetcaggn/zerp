# openapi_sale.api.ShopUpdateShopApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateShop**](ShopUpdateShopApi.md#) | **PUT** /sale/shops/{id} | Update: Update an existing entity


# **updateShop**
> ApiResponseShopDTO updateShop(id, body)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ShopUpdateShopApi();
final id = 1; // String | Unique identifier of the entity to update
final body = Object(); // Object | 

try {
    final result = api_instance.updateShop(id, body);
    print(result);
} catch (e) {
    print('Exception when calling ShopUpdateShopApi->updateShop: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **body** | **Object**|  | 

### Return type

[**ApiResponseShopDTO**](ApiResponseShopDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

