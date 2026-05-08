# openapi_crm.api.TeamsRemoveTeamMemberApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**removeTeamMember**](TeamsRemoveTeamMemberApi.md#) | **DELETE** /crm/teams/{id}/members/{userId} | 


# **removeTeamMember**
> TeamResponse removeTeamMember(id, userId)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsRemoveTeamMemberApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final userId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.removeTeamMember(id, userId);
    print(result);
} catch (e) {
    print('Exception when calling TeamsRemoveTeamMemberApi->removeTeamMember: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **userId** | **String**|  | 

### Return type

[**TeamResponse**](TeamResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

