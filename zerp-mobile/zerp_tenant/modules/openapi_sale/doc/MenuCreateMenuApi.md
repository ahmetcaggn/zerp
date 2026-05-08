# openapi_sale.api.MenuCreateMenuApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createMenu**](MenuCreateMenuApi.md#) | **POST** /sale/menus | Create: Create a new entity


# **createMenu**
> ApiResponseMenuDTO createMenu(menuCreateDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = MenuCreateMenuApi();
final menuCreateDTO = MenuCreateDTO(); // MenuCreateDTO | 

try {
    final result = api_instance.createMenu(menuCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling MenuCreateMenuApi->createMenu: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **menuCreateDTO** | [**MenuCreateDTO**](MenuCreateDTO.md)|  | 

### Return type

[**ApiResponseMenuDTO**](ApiResponseMenuDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

