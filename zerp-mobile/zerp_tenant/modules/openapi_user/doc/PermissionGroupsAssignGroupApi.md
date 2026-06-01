# openapi_user.api.PermissionGroupsAssignGroupApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**assignGroup**](PermissionGroupsAssignGroupApi.md#) | **POST** /user/permission-groups/assign | 


# **assignGroup**
> ApiResponsePermissionGroupAssignResponseDTO assignGroup(permissionGroupAssignRequestDTO)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsAssignGroupApi();
final permissionGroupAssignRequestDTO = PermissionGroupAssignRequestDTO(); // PermissionGroupAssignRequestDTO | 

try {
    final result = api_instance.assignGroup(permissionGroupAssignRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsAssignGroupApi->assignGroup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **permissionGroupAssignRequestDTO** | [**PermissionGroupAssignRequestDTO**](PermissionGroupAssignRequestDTO.md)|  | 

### Return type

[**ApiResponsePermissionGroupAssignResponseDTO**](ApiResponsePermissionGroupAssignResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

