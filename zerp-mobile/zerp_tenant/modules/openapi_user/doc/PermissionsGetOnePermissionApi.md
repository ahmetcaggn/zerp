# openapi_user.api.PermissionsGetOnePermissionApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getOnePermission**](PermissionsGetOnePermissionApi.md#) | **GET** /user/permissions/{id} | GetOne: Get single entity by ID


# **getOnePermission**
> ApiResponsePermissionResponse getOnePermission(id)

GetOne: Get single entity by ID

Retrieves a single entity by its unique identifier. Implements ra-spring-data-provider's getOne operation. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionsGetOnePermissionApi();
final id = 1; // int | Unique identifier of the entity to retrieve

try {
    final result = api_instance.getOnePermission(id);
    print(result);
} catch (e) {
    print('Exception when calling PermissionsGetOnePermissionApi->getOnePermission: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Unique identifier of the entity to retrieve | 

### Return type

[**ApiResponsePermissionResponse**](ApiResponsePermissionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

