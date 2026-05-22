# openapi_sale.api.MenuUpdateMenuApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateMenu**](MenuUpdateMenuApi.md#) | **PUT** /sale/menus/{id} | Update: Update an existing entity


# **updateMenu**
> ApiResponseMenuDTO updateMenu(id, menuUpdateDTO)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = MenuUpdateMenuApi();
final id = 1; // String | Unique identifier of the entity to update
final menuUpdateDTO = MenuUpdateDTO(); // MenuUpdateDTO | 

try {
    final result = api_instance.updateMenu(id, menuUpdateDTO);
    print(result);
} catch (e) {
    print('Exception when calling MenuUpdateMenuApi->updateMenu: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **menuUpdateDTO** | [**MenuUpdateDTO**](MenuUpdateDTO.md)|  | 

### Return type

[**ApiResponseMenuDTO**](ApiResponseMenuDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

