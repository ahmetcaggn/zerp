# openapi_sale.api.ShopCreateShopApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createShop**](ShopCreateShopApi.md#) | **POST** /sale/shops | Create: Create a new entity


# **createShop**
> ApiResponseShopDTO createShop(body)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ShopCreateShopApi();
final body = Object(); // Object | 

try {
    final result = api_instance.createShop(body);
    print(result);
} catch (e) {
    print('Exception when calling ShopCreateShopApi->createShop: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **Object**|  | 

### Return type

[**ApiResponseShopDTO**](ApiResponseShopDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

