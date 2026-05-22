# openapi_sale.api.MenuItemGetOneMenuItemApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getOneMenuItem**](MenuItemGetOneMenuItemApi.md#) | **GET** /sale/menu-items/{id} | GetOne: Get single entity by ID


# **getOneMenuItem**
> ApiResponseMenuItemDTO getOneMenuItem(id)

GetOne: Get single entity by ID

Retrieves a single entity by its unique identifier. Implements ra-spring-data-provider's getOne operation. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = MenuItemGetOneMenuItemApi();
final id = 1; // String | Unique identifier of the entity to retrieve

try {
    final result = api_instance.getOneMenuItem(id);
    print(result);
} catch (e) {
    print('Exception when calling MenuItemGetOneMenuItemApi->getOneMenuItem: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to retrieve | 

### Return type

[**ApiResponseMenuItemDTO**](ApiResponseMenuItemDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

