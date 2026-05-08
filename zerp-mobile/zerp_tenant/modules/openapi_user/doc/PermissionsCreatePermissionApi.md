# openapi_user.api.PermissionsCreatePermissionApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createPermission**](PermissionsCreatePermissionApi.md#) | **POST** /user/permissions | Create: Create a new entity


# **createPermission**
> ApiResponsePermissionResponse createPermission(permissionCreateRequestDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionsCreatePermissionApi();
final permissionCreateRequestDTO = PermissionCreateRequestDTO(); // PermissionCreateRequestDTO | 

try {
    final result = api_instance.createPermission(permissionCreateRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling PermissionsCreatePermissionApi->createPermission: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **permissionCreateRequestDTO** | [**PermissionCreateRequestDTO**](PermissionCreateRequestDTO.md)|  | 

### Return type

[**ApiResponsePermissionResponse**](ApiResponsePermissionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

