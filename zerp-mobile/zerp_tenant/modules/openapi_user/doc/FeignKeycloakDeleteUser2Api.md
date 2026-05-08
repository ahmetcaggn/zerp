# openapi_user.api.FeignKeycloakDeleteUser2Api

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteUser2**](FeignKeycloakDeleteUser2Api.md#) | **DELETE** /feign/keycloak/users/{id} | 


# **deleteUser2**
> ApiResponseVoid deleteUser2(id)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = FeignKeycloakDeleteUser2Api();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.deleteUser2(id);
    print(result);
} catch (e) {
    print('Exception when calling FeignKeycloakDeleteUser2Api->deleteUser2: $e\n');
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

