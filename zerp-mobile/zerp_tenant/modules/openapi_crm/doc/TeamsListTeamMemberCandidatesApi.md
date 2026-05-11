# openapi_crm.api.TeamsListTeamMemberCandidatesApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**listTeamMemberCandidates**](TeamsListTeamMemberCandidatesApi.md#) | **GET** /crm/teams/{id}/member-candidates | 


# **listTeamMemberCandidates**
> ApiResponseListTeamMemberCandidateResponse listTeamMemberCandidates(id, start, end, sort, order, username)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsListTeamMemberCandidatesApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final start = 56; // int | 
final end = 56; // int | 
final sort = sort_example; // String | 
final order = order_example; // String | 
final username = username_example; // String | 

try {
    final result = api_instance.listTeamMemberCandidates(id, start, end, sort, order, username);
    print(result);
} catch (e) {
    print('Exception when calling TeamsListTeamMemberCandidatesApi->listTeamMemberCandidates: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **start** | **int**|  | [optional] [default to 0]
 **end** | **int**|  | [optional] [default to 10]
 **sort** | **String**|  | [optional] [default to 'username']
 **order** | **String**|  | [optional] [default to 'ASC']
 **username** | **String**|  | [optional] 

### Return type

[**ApiResponseListTeamMemberCandidateResponse**](ApiResponseListTeamMemberCandidateResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

