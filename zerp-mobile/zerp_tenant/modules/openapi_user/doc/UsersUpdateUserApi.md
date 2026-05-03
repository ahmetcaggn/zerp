# openapi_user.api.UsersUpdateUserApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *http://192.168.0.106:8087*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateUser**](UsersUpdateUserApi.md#) | **PUT** /user/{id} | Update: Update an existing entity


# **updateUser**
> ApiResponseUserResponseDTO updateUser(id, body)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = UsersUpdateUserApi();
final id = 1; // String | Unique identifier of the entity to update
final body = Object(); // Object | 

try {
    final result = api_instance.updateUser(id, body);
    print(result);
} catch (e) {
    print('Exception when calling UsersUpdateUserApi->updateUser: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **body** | **Object**|  | 

### Return type

[**ApiResponseUserResponseDTO**](ApiResponseUserResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

