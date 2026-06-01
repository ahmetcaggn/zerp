# openapi_user.api.PermissionGroupsDeleteCustomGroupApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteCustomGroup**](PermissionGroupsDeleteCustomGroupApi.md#) | **DELETE** /user/permission-groups/{id} | 


# **deleteCustomGroup**
> ApiResponseVoid deleteCustomGroup(id)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsDeleteCustomGroupApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.deleteCustomGroup(id);
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsDeleteCustomGroupApi->deleteCustomGroup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**ApiResponseVoid**](ApiResponseVoid.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

