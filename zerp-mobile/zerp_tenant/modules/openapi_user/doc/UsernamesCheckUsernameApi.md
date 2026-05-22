# openapi_user.api.UsernamesCheckUsernameApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**checkUsername**](UsernamesCheckUsernameApi.md#) | **GET** /user/usernames/check | 


# **checkUsername**
> ApiResponseUsernameCheckResponseDTO checkUsername(username)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = UsernamesCheckUsernameApi();
final username = username_example; // String | 

try {
    final result = api_instance.checkUsername(username);
    print(result);
} catch (e) {
    print('Exception when calling UsernamesCheckUsernameApi->checkUsername: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **username** | **String**|  | 

### Return type

[**ApiResponseUsernameCheckResponseDTO**](ApiResponseUsernameCheckResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

