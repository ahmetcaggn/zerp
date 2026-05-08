# openapi_user.api.FeignUserCheckUserExistsApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**checkUserExists**](FeignUserCheckUserExistsApi.md#) | **POST** /feign/users | 


# **checkUserExists**
> ApiResponseUserCheckResponseDTO checkUserExists(userCreateIfNotExistRequestDTO)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = FeignUserCheckUserExistsApi();
final userCreateIfNotExistRequestDTO = UserCreateIfNotExistRequestDTO(); // UserCreateIfNotExistRequestDTO | 

try {
    final result = api_instance.checkUserExists(userCreateIfNotExistRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling FeignUserCheckUserExistsApi->checkUserExists: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userCreateIfNotExistRequestDTO** | [**UserCreateIfNotExistRequestDTO**](UserCreateIfNotExistRequestDTO.md)|  | 

### Return type

[**ApiResponseUserCheckResponseDTO**](ApiResponseUserCheckResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

