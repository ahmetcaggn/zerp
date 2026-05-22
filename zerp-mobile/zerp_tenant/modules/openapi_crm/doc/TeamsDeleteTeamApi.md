# openapi_crm.api.TeamsDeleteTeamApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteTeam**](TeamsDeleteTeamApi.md#) | **DELETE** /crm/teams/{id} | Delete: Delete a single entity


# **deleteTeam**
> ApiResponseVoid deleteTeam(id)

Delete: Delete a single entity

Deletes a single entity by its unique identifier. Implements ra-spring-data-provider's delete operation. 

### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsDeleteTeamApi();
final id = 1; // String | Unique identifier of the entity to delete

try {
    final result = api_instance.deleteTeam(id);
    print(result);
} catch (e) {
    print('Exception when calling TeamsDeleteTeamApi->deleteTeam: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to delete | 

### Return type

[**ApiResponseVoid**](ApiResponseVoid.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

