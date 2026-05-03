# openapi_user.api.FeignUserDeleteUser1Api

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *http://192.168.0.106:8087*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteUser1**](FeignUserDeleteUser1Api.md#) | **DELETE** /feign/users/{id} | 


# **deleteUser1**
> ApiResponseVoid deleteUser1(id)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = FeignUserDeleteUser1Api();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.deleteUser1(id);
    print(result);
} catch (e) {
    print('Exception when calling FeignUserDeleteUser1Api->deleteUser1: $e\n');
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

