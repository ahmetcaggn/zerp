# openapi_crm.api.TeamsPatchTeamApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**patchTeam**](TeamsPatchTeamApi.md#) | **PATCH** /crm/teams/{id} | Update: Update an existing entity


# **patchTeam**
> ApiResponseTeamResponse patchTeam(id, requestBody)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsPatchTeamApi();
final id = 1; // String | Unique identifier of the entity to update
final requestBody = Map<String, Object>(); // Map<String, Object> | 

try {
    final result = api_instance.patchTeam(id, requestBody);
    print(result);
} catch (e) {
    print('Exception when calling TeamsPatchTeamApi->patchTeam: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **requestBody** | [**Map<String, Object>**](Object.md)|  | 

### Return type

[**ApiResponseTeamResponse**](ApiResponseTeamResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

