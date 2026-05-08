# openapi_sale.api.ProductExtraOptionGetOneProductExtraOptionApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getOneProductExtraOption**](ProductExtraOptionGetOneProductExtraOptionApi.md#) | **GET** /sale/product-extra-options/{id} | GetOne: Get single entity by ID


# **getOneProductExtraOption**
> ApiResponseProductExtraOptionDTO getOneProductExtraOption(id)

GetOne: Get single entity by ID

Retrieves a single entity by its unique identifier. Implements ra-spring-data-provider's getOne operation. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ProductExtraOptionGetOneProductExtraOptionApi();
final id = 1; // String | Unique identifier of the entity to retrieve

try {
    final result = api_instance.getOneProductExtraOption(id);
    print(result);
} catch (e) {
    print('Exception when calling ProductExtraOptionGetOneProductExtraOptionApi->getOneProductExtraOption: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to retrieve | 

### Return type

[**ApiResponseProductExtraOptionDTO**](ApiResponseProductExtraOptionDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

