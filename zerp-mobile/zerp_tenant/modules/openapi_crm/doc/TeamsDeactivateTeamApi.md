# openapi_crm.api.TeamsDeactivateTeamApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.106:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deactivateTeam**](TeamsDeactivateTeamApi.md#) | **POST** /crm/teams/{id}/deactivate | 


# **deactivateTeam**
> TeamResponse deactivateTeam(id)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsDeactivateTeamApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.deactivateTeam(id);
    print(result);
} catch (e) {
    print('Exception when calling TeamsDeactivateTeamApi->deactivateTeam: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**TeamResponse**](TeamResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

