# openapi_sale.api.MenuCategoryDeleteMenuCategoryApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteMenuCategory**](MenuCategoryDeleteMenuCategoryApi.md#) | **DELETE** /sale/menu-categories/{id} | Delete: Delete a single entity


# **deleteMenuCategory**
> ApiResponseVoid deleteMenuCategory(id)

Delete: Delete a single entity

Deletes a single entity by its unique identifier. Implements ra-spring-data-provider's delete operation. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = MenuCategoryDeleteMenuCategoryApi();
final id = 1; // String | Unique identifier of the entity to delete

try {
    final result = api_instance.deleteMenuCategory(id);
    print(result);
} catch (e) {
    print('Exception when calling MenuCategoryDeleteMenuCategoryApi->deleteMenuCategory: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to delete | 

### Return type

[**ApiResponseVoid**](ApiResponseVoid.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

