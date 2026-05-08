# openapi_user.api.PermissionsPatchManyPermissionsApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**patchManyPermissions**](PermissionsPatchManyPermissionsApi.md#) | **PATCH** /user/permissions | UpdateMany: Update multiple entities


# **patchManyPermissions**
> ApiResponseListLong patchManyPermissions(requestBody, id)

UpdateMany: Update multiple entities

Updates multiple entities with the same field values in a single operation. Implements ra-spring-data-provider's updateMany operation for bulk updates. Returns a list of updated entity IDs. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionsPatchManyPermissionsApi();
final requestBody = Map<String, Object>(); // Map<String, Object> | 
final id = [[1,2,3]]; // List<int> | List of entity IDs to update

try {
    final result = api_instance.patchManyPermissions(requestBody, id);
    print(result);
} catch (e) {
    print('Exception when calling PermissionsPatchManyPermissionsApi->patchManyPermissions: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestBody** | [**Map<String, Object>**](Object.md)|  | 
 **id** | [**List<int>**](int.md)| List of entity IDs to update | [optional] [default to const []]

### Return type

[**ApiResponseListLong**](ApiResponseListLong.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

