# openapi_sale.api.ShopTableCreateShopTableApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createShopTable**](ShopTableCreateShopTableApi.md#) | **POST** /sale/tables | Create: Create a new entity


# **createShopTable**
> ApiResponseShopTableDTO createShopTable(shopTableCreateDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ShopTableCreateShopTableApi();
final shopTableCreateDTO = ShopTableCreateDTO(); // ShopTableCreateDTO | 

try {
    final result = api_instance.createShopTable(shopTableCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling ShopTableCreateShopTableApi->createShopTable: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopTableCreateDTO** | [**ShopTableCreateDTO**](ShopTableCreateDTO.md)|  | 

### Return type

[**ApiResponseShopTableDTO**](ApiResponseShopTableDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

