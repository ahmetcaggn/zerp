# openapi_sale.api.ProductExtraOptionDeleteProductExtraOptionApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteProductExtraOption**](ProductExtraOptionDeleteProductExtraOptionApi.md#) | **DELETE** /sale/product-extra-options/{id} | Delete: Delete a single entity


# **deleteProductExtraOption**
> ApiResponseVoid deleteProductExtraOption(id)

Delete: Delete a single entity

Deletes a single entity by its unique identifier. Implements ra-spring-data-provider's delete operation. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ProductExtraOptionDeleteProductExtraOptionApi();
final id = 1; // String | Unique identifier of the entity to delete

try {
    final result = api_instance.deleteProductExtraOption(id);
    print(result);
} catch (e) {
    print('Exception when calling ProductExtraOptionDeleteProductExtraOptionApi->deleteProductExtraOption: $e\n');
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

