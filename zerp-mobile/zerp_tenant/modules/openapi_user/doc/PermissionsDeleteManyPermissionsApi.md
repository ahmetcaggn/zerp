# openapi_user.api.PermissionsDeleteManyPermissionsApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteManyPermissions**](PermissionsDeleteManyPermissionsApi.md#) | **DELETE** /user/permissions | DeleteMany: Delete multiple entities


# **deleteManyPermissions**
> ApiResponseListLong deleteManyPermissions(id)

DeleteMany: Delete multiple entities

Deletes multiple entities in a single operation. Implements ra-spring-data-provider's deleteMany operation for bulk deletions. Returns a list of deleted entity IDs. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermissionsDeleteManyPermissionsApi();
final id = [[1,2,3]]; // List<int> | List of entity IDs to delete

try {
    final result = api_instance.deleteManyPermissions(id);
    print(result);
} catch (e) {
    print('Exception when calling PermissionsDeleteManyPermissionsApi->deleteManyPermissions: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**List<int>**](int.md)| List of entity IDs to delete | [optional] [default to const []]

### Return type

[**ApiResponseListLong**](ApiResponseListLong.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

