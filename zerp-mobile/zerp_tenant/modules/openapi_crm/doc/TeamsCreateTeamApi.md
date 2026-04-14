# openapi_crm.api.TeamsCreateTeamApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.103:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTeam**](TeamsCreateTeamApi.md#) | **POST** /api/teams | Create: Create a new entity


# **createTeam**
> ApiResponseTeamResponse createTeam(createTeamRequest)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsCreateTeamApi();
final createTeamRequest = CreateTeamRequest(); // CreateTeamRequest | 

try {
    final result = api_instance.createTeam(createTeamRequest);
    print(result);
} catch (e) {
    print('Exception when calling TeamsCreateTeamApi->createTeam: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createTeamRequest** | [**CreateTeamRequest**](CreateTeamRequest.md)|  | 

### Return type

[**ApiResponseTeamResponse**](ApiResponseTeamResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

