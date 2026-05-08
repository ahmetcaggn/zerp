# openapi_user.api.UsersCreateUserApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUser**](UsersCreateUserApi.md#) | **POST** /user | Create: Create a new entity


# **createUser**
> ApiResponseUserResponseDTO createUser(body)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = UsersCreateUserApi();
final body = Object(); // Object | 

try {
    final result = api_instance.createUser(body);
    print(result);
} catch (e) {
    print('Exception when calling UsersCreateUserApi->createUser: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **Object**|  | 

### Return type

[**ApiResponseUserResponseDTO**](ApiResponseUserResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

