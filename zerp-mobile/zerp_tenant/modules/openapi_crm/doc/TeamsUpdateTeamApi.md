# openapi_crm.api.TeamsUpdateTeamApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.103:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateTeam**](TeamsUpdateTeamApi.md#) | **PUT** /api/teams/{id} | Update: Update an existing entity


# **updateTeam**
> ApiResponseTeamResponse updateTeam(id, updateTeamRequest)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsUpdateTeamApi();
final id = 1; // int | Unique identifier of the entity to update
final updateTeamRequest = UpdateTeamRequest(); // UpdateTeamRequest | 

try {
    final result = api_instance.updateTeam(id, updateTeamRequest);
    print(result);
} catch (e) {
    print('Exception when calling TeamsUpdateTeamApi->updateTeam: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Unique identifier of the entity to update | 
 **updateTeamRequest** | [**UpdateTeamRequest**](UpdateTeamRequest.md)|  | 

### Return type

[**ApiResponseTeamResponse**](ApiResponseTeamResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

