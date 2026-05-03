# openapi_user.api.PermissionsDeletePermissionApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *http://192.168.0.106:8087*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deletePermission**](PermissionsDeletePermissionApi.md#) | **DELETE** /user/permissions/{id} | Delete: Delete a single entity


# **deletePermission**
> ApiResponseVoid deletePermission(id)

Delete: Delete a single entity

Deletes a single entity by its unique identifier. Implements ra-spring-data-provider's delete operation. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionsDeletePermissionApi();
final id = 1; // int | Unique identifier of the entity to delete

try {
    final result = api_instance.deletePermission(id);
    print(result);
} catch (e) {
    print('Exception when calling PermissionsDeletePermissionApi->deletePermission: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Unique identifier of the entity to delete | 

### Return type

[**ApiResponseVoid**](ApiResponseVoid.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

