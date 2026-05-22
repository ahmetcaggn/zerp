# openapi_sale.api.MenuCategoryUpdateMenuCategoryApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateMenuCategory**](MenuCategoryUpdateMenuCategoryApi.md#) | **PUT** /sale/menu-categories/{id} | Update: Update an existing entity


# **updateMenuCategory**
> ApiResponseMenuCategoryDTO updateMenuCategory(id, menuCategoryUpdateDTO)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = MenuCategoryUpdateMenuCategoryApi();
final id = 1; // String | Unique identifier of the entity to update
final menuCategoryUpdateDTO = MenuCategoryUpdateDTO(); // MenuCategoryUpdateDTO | 

try {
    final result = api_instance.updateMenuCategory(id, menuCategoryUpdateDTO);
    print(result);
} catch (e) {
    print('Exception when calling MenuCategoryUpdateMenuCategoryApi->updateMenuCategory: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **menuCategoryUpdateDTO** | [**MenuCategoryUpdateDTO**](MenuCategoryUpdateDTO.md)|  | 

### Return type

[**ApiResponseMenuCategoryDTO**](ApiResponseMenuCategoryDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

