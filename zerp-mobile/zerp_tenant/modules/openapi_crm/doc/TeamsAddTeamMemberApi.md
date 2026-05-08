# openapi_crm.api.TeamsAddTeamMemberApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addTeamMember**](TeamsAddTeamMemberApi.md#) | **POST** /crm/teams/{id}/members | 


# **addTeamMember**
> TeamResponse addTeamMember(id, addMemberRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsAddTeamMemberApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final addMemberRequest = AddMemberRequest(); // AddMemberRequest | 

try {
    final result = api_instance.addTeamMember(id, addMemberRequest);
    print(result);
} catch (e) {
    print('Exception when calling TeamsAddTeamMemberApi->addTeamMember: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **addMemberRequest** | [**AddMemberRequest**](AddMemberRequest.md)|  | 

### Return type

[**TeamResponse**](TeamResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

