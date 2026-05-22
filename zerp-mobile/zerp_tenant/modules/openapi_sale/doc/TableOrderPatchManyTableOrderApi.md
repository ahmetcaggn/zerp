# openapi_sale.api.TableOrderPatchManyTableOrderApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**patchManyTableOrder**](TableOrderPatchManyTableOrderApi.md#) | **PATCH** /sale/table-orders | UpdateMany: Update multiple entities


# **patchManyTableOrder**
> ApiResponseListUUID patchManyTableOrder(requestBody, id)

UpdateMany: Update multiple entities

Updates multiple entities with the same field values in a single operation. Implements ra-spring-data-provider's updateMany operation for bulk updates. Returns a list of updated entity IDs. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = TableOrderPatchManyTableOrderApi();
final requestBody = Map<String, Object>(); // Map<String, Object> | 
final id = [[1, 2, 3]]; // List<String> | List of entity IDs to update

try {
    final result = api_instance.patchManyTableOrder(requestBody, id);
    print(result);
} catch (e) {
    print('Exception when calling TableOrderPatchManyTableOrderApi->patchManyTableOrder: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestBody** | [**Map<String, Object>**](Object.md)|  | 
 **id** | [**List<String>**](String.md)| List of entity IDs to update | [optional] [default to const []]

### Return type

[**ApiResponseListUUID**](ApiResponseListUUID.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

