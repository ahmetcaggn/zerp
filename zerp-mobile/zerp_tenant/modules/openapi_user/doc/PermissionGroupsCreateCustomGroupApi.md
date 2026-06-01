# openapi_user.api.PermissionGroupsCreateCustomGroupApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createCustomGroup**](PermissionGroupsCreateCustomGroupApi.md#) | **POST** /user/permission-groups | 


# **createCustomGroup**
> ApiResponsePermissionGroupResponseDTO createCustomGroup(permissionGroupCreateRequestDTO)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionGroupsCreateCustomGroupApi();
final permissionGroupCreateRequestDTO = PermissionGroupCreateRequestDTO(); // PermissionGroupCreateRequestDTO | 

try {
    final result = api_instance.createCustomGroup(permissionGroupCreateRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling PermissionGroupsCreateCustomGroupApi->createCustomGroup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **permissionGroupCreateRequestDTO** | [**PermissionGroupCreateRequestDTO**](PermissionGroupCreateRequestDTO.md)|  | 

### Return type

[**ApiResponsePermissionGroupResponseDTO**](ApiResponsePermissionGroupResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

