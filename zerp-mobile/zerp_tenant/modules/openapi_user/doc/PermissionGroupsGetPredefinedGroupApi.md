# openapi_user.api.PermissionGroupsGetPredefinedGroupApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPredefinedGroup**](PermissionGroupsGetPredefinedGroupApi.md#) | **GET** /user/permission-groups/predefined/{code} | 


# **getPredefinedGroup**
> ApiResponsePermissionGroupResponseDTO getPredefinedGroup(code)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsGetPredefinedGroupApi();
final code = code_example; // String | 

try {
    final result = api_instance.getPredefinedGroup(code);
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsGetPredefinedGroupApi->getPredefinedGroup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | **String**|  | 

### Return type

[**ApiResponsePermissionGroupResponseDTO**](ApiResponsePermissionGroupResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

