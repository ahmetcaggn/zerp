# openapi_user.api.PermissionsPatchPermissionApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *http://192.168.0.106:8087*

Method | HTTP request | Description
------------- | ------------- | -------------
[**patchPermission**](PermissionsPatchPermissionApi.md#) | **PATCH** /user/permissions/{id} | Update: Update an existing entity


# **patchPermission**
> ApiResponsePermissionResponse patchPermission(id, requestBody)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionsPatchPermissionApi();
final id = 1; // int | Unique identifier of the entity to update
final requestBody = Map<String, Object>(); // Map<String, Object> | 

try {
    final result = api_instance.patchPermission(id, requestBody);
    print(result);
} catch (e) {
    print('Exception when calling PermissionsPatchPermissionApi->patchPermission: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Unique identifier of the entity to update | 
 **requestBody** | [**Map<String, Object>**](Object.md)|  | 

### Return type

[**ApiResponsePermissionResponse**](ApiResponsePermissionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

