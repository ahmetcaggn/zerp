# openapi_user.api.PermissionGroupsPatchCustomGroupApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**patchCustomGroup**](PermissionGroupsPatchCustomGroupApi.md#) | **PATCH** /user/permission-groups/{id} | 


# **patchCustomGroup**
> ApiResponsePermissionGroupResponseDTO patchCustomGroup(id, permissionGroupPatchRequestDTO)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsPatchCustomGroupApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final permissionGroupPatchRequestDTO = PermissionGroupPatchRequestDTO(); // PermissionGroupPatchRequestDTO | 

try {
    final result = api_instance.patchCustomGroup(id, permissionGroupPatchRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsPatchCustomGroupApi->patchCustomGroup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **permissionGroupPatchRequestDTO** | [**PermissionGroupPatchRequestDTO**](PermissionGroupPatchRequestDTO.md)|  | 

### Return type

[**ApiResponsePermissionGroupResponseDTO**](ApiResponsePermissionGroupResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

