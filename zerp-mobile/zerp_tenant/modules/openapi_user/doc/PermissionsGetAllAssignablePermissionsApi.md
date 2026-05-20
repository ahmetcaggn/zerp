# openapi_user.api.PermissionsGetAllAssignablePermissionsApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAllAssignablePermissions**](PermissionsGetAllAssignablePermissionsApi.md#) | **GET** /user/permissions/actions-assignable | 


# **getAllAssignablePermissions**
> ApiResponseMapPermissionActionListPermissionTargetType getAllAssignablePermissions()



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionsGetAllAssignablePermissionsApi();

try {
    final result = api_instance.getAllAssignablePermissions();
    print(result);
} catch (e) {
    print('Exception when calling PermissionsGetAllAssignablePermissionsApi->getAllAssignablePermissions: $e\n');
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

