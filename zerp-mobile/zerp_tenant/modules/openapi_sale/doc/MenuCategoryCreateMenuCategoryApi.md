# openapi_sale.api.MenuCategoryCreateMenuCategoryApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createMenuCategory**](MenuCategoryCreateMenuCategoryApi.md#) | **POST** /sale/menu-categories | Create: Create a new entity


# **createMenuCategory**
> ApiResponseMenuCategoryDTO createMenuCategory(menuCategoryCreateDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = MenuCategoryCreateMenuCategoryApi();
final menuCategoryCreateDTO = MenuCategoryCreateDTO(); // MenuCategoryCreateDTO | 

try {
    final result = api_instance.createMenuCategory(menuCategoryCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling MenuCategoryCreateMenuCategoryApi->createMenuCategory: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **menuCategoryCreateDTO** | [**MenuCategoryCreateDTO**](MenuCategoryCreateDTO.md)|  | 

### Return type

[**ApiResponseMenuCategoryDTO**](ApiResponseMenuCategoryDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

