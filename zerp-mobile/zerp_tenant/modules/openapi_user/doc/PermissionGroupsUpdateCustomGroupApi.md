# openapi_user.api.PermissionGroupsUpdateCustomGroupApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateCustomGroup**](PermissionGroupsUpdateCustomGroupApi.md#) | **PUT** /user/permission-groups/{id} | 


# **updateCustomGroup**
> ApiResponsePermissionGroupResponseDTO updateCustomGroup(id, permissionGroupUpdateRequestDTO)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsUpdateCustomGroupApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final permissionGroupUpdateRequestDTO = PermissionGroupUpdateRequestDTO(); // PermissionGroupUpdateRequestDTO | 

try {
    final result = api_instance.updateCustomGroup(id, permissionGroupUpdateRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsUpdateCustomGroupApi->updateCustomGroup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **permissionGroupUpdateRequestDTO** | [**PermissionGroupUpdateRequestDTO**](PermissionGroupUpdateRequestDTO.md)|  | 

### Return type

[**ApiResponsePermissionGroupResponseDTO**](ApiResponsePermissionGroupResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

