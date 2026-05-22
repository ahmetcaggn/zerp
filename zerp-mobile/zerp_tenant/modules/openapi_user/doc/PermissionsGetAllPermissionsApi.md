# openapi_user.api.PermissionsGetAllPermissionsApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAllPermissions**](PermissionsGetAllPermissionsApi.md#) | **GET** /user/permissions/actions | 


# **getAllPermissions**
> ApiResponseMapPermissionActionListPermissionTargetType getAllPermissions()



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionsGetAllPermissionsApi();

try {
    final result = api_instance.getAllPermissions();
    print(result);
} catch (e) {
    print('Exception when calling PermissionsGetAllPermissionsApi->getAllPermissions: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResponseMapPermissionActionListPermissionTargetType**](ApiResponseMapPermissionActionListPermissionTargetType.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

