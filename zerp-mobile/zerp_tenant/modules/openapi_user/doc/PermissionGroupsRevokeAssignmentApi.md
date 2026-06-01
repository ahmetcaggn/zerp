# openapi_user.api.PermissionGroupsRevokeAssignmentApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**revokeAssignment**](PermissionGroupsRevokeAssignmentApi.md#) | **DELETE** /user/permission-groups/assignments/{assignmentId} | 


# **revokeAssignment**
> ApiResponsePermissionGroupAssignmentRevokeResponseDTO revokeAssignment(assignmentId)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsRevokeAssignmentApi();
final assignmentId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.revokeAssignment(assignmentId);
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsRevokeAssignmentApi->revokeAssignment: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **assignmentId** | **String**|  | 

### Return type

[**ApiResponsePermissionGroupAssignmentRevokeResponseDTO**](ApiResponsePermissionGroupAssignmentRevokeResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

