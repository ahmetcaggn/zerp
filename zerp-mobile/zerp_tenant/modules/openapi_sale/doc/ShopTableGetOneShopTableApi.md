# openapi_sale.api.ShopTableGetOneShopTableApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getOneShopTable**](ShopTableGetOneShopTableApi.md#) | **GET** /sale/tables/{id} | GetOne: Get single entity by ID


# **getOneShopTable**
> ApiResponseShopTableDTO getOneShopTable(id)

GetOne: Get single entity by ID

Retrieves a single entity by its unique identifier. Implements ra-spring-data-provider's getOne operation. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ShopTableGetOneShopTableApi();
final id = 1; // String | Unique identifier of the entity to retrieve

try {
    final result = api_instance.getOneShopTable(id);
    print(result);
} catch (e) {
    print('Exception when calling ShopTableGetOneShopTableApi->getOneShopTable: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to retrieve | 

### Return type

[**ApiResponseShopTableDTO**](ApiResponseShopTableDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

