# openapi_user.api.PermissionsUpdatePermissionApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updatePermission**](PermissionsUpdatePermissionApi.md#) | **PUT** /user/permissions/{id} | Update: Update an existing entity


# **updatePermission**
> ApiResponsePermissionResponse updatePermission(id, permissionUpdateRequest)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionsUpdatePermissionApi();
final id = 1; // int | Unique identifier of the entity to update
final permissionUpdateRequest = PermissionUpdateRequest(); // PermissionUpdateRequest | 

try {
    final result = api_instance.updatePermission(id, permissionUpdateRequest);
    print(result);
} catch (e) {
    print('Exception when calling PermissionsUpdatePermissionApi->updatePermission: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Unique identifier of the entity to update | 
 **permissionUpdateRequest** | [**PermissionUpdateRequest**](PermissionUpdateRequest.md)|  | 

### Return type

[**ApiResponsePermissionResponse**](ApiResponsePermissionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

