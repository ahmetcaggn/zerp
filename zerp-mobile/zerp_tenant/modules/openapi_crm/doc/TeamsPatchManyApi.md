# openapi_crm.api.TeamsPatchManyApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.112:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**patchMany**](TeamsPatchManyApi.md#) | **PATCH** /api/teams | UpdateMany: Update multiple entities


# **patchMany**
> ApiResponseListInteger patchMany(requestBody, id)

UpdateMany: Update multiple entities

Updates multiple entities with the same field values in a single operation. Implements ra-spring-data-provider's updateMany operation for bulk updates. Returns a list of updated entity IDs. 

### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsPatchManyApi();
final requestBody = Map<String, Object>(); // Map<String, Object> | 
final id = [[1,2,3]]; // List<int> | List of entity IDs to update

try {
    final result = api_instance.patchMany(requestBody, id);
    print(result);
} catch (e) {
    print('Exception when calling TeamsPatchManyApi->patchMany: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestBody** | [**Map<String, Object>**](Object.md)|  | 
 **id** | [**List<int>**](int.md)| List of entity IDs to update | [optional] [default to const []]

### Return type

[**ApiResponseListInteger**](ApiResponseListInteger.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

