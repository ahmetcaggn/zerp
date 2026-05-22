# openapi_sale.api.ProductExtraOptionDeleteManyProductExtraOptionApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteManyProductExtraOption**](ProductExtraOptionDeleteManyProductExtraOptionApi.md#) | **DELETE** /sale/product-extra-options | DeleteMany: Delete multiple entities


# **deleteManyProductExtraOption**
> ApiResponseListUUID deleteManyProductExtraOption(id)

DeleteMany: Delete multiple entities

Deletes multiple entities in a single operation. Implements ra-spring-data-provider's deleteMany operation for bulk deletions. Returns a list of deleted entity IDs. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ProductExtraOptionDeleteManyProductExtraOptionApi();
final id = [[1, 2, 3]]; // List<String> | List of entity IDs to delete

try {
    final result = api_instance.deleteManyProductExtraOption(id);
    print(result);
} catch (e) {
    print('Exception when calling ProductExtraOptionDeleteManyProductExtraOptionApi->deleteManyProductExtraOption: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**List<String>**](String.md)| List of entity IDs to delete | [optional] [default to const []]

### Return type

[**ApiResponseListUUID**](ApiResponseListUUID.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

