# openapi_user.api.PermissionGroupsListAssignmentsByUserApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**listAssignmentsByUser**](PermissionGroupsListAssignmentsByUserApi.md#) | **GET** /user/permission-groups/assignments | 


# **listAssignmentsByUser**
> ApiResponseListPermissionGroupAssignmentResponseDTO listAssignmentsByUser(userId)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsListAssignmentsByUserApi();
final userId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.listAssignmentsByUser(userId);
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsListAssignmentsByUserApi->listAssignmentsByUser: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

[**ApiResponseListPermissionGroupAssignmentResponseDTO**](ApiResponseListPermissionGroupAssignmentResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

