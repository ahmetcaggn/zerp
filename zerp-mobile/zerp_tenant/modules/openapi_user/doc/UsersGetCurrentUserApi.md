# openapi_user.api.UsersGetCurrentUserApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCurrentUser**](UsersGetCurrentUserApi.md#) | **GET** /user/me | Get currently authenticated user profile


# **getCurrentUser**
> ApiResponseCurrentUserProfileDTO getCurrentUser()

Get currently authenticated user profile

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = UsersGetCurrentUserApi();

try {
    final result = api_instance.getCurrentUser();
    print(result);
} catch (e) {
    print('Exception when calling UsersGetCurrentUserApi->getCurrentUser: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResponseCurrentUserProfileDTO**](ApiResponseCurrentUserProfileDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

