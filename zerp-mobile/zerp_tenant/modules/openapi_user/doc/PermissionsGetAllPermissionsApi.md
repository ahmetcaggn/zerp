# openapi_user.api.PermissionsGetAllPermissionsApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAllPermissions**](PermissionsGetAllPermissionsApi.md#) | **GET** /user/permissions/actions | 


# **getAllPermissions**
> ApiResponseListPermissionAction getAllPermissions()



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

[**ApiResponseListPermissionAction**](ApiResponseListPermissionAction.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

