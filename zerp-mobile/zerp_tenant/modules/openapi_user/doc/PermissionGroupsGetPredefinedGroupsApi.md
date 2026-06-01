# openapi_user.api.PermissionGroupsGetPredefinedGroupsApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPredefinedGroups**](PermissionGroupsGetPredefinedGroupsApi.md#) | **GET** /user/permission-groups/predefined | 


# **getPredefinedGroups**
> ApiResponseListPermissionGroupResponseDTO getPredefinedGroups()



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsGetPredefinedGroupsApi();

try {
    final result = api_instance.getPredefinedGroups();
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsGetPredefinedGroupsApi->getPredefinedGroups: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResponseListPermissionGroupResponseDTO**](ApiResponseListPermissionGroupResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

