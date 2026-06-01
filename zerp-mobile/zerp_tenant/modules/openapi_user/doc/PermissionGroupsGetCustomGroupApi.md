# openapi_user.api.PermissionGroupsGetCustomGroupApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCustomGroup**](PermissionGroupsGetCustomGroupApi.md#) | **GET** /user/permission-groups/{id} | 


# **getCustomGroup**
> ApiResponsePermissionGroupResponseDTO getCustomGroup(id)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsGetCustomGroupApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.getCustomGroup(id);
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsGetCustomGroupApi->getCustomGroup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**ApiResponsePermissionGroupResponseDTO**](ApiResponsePermissionGroupResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

