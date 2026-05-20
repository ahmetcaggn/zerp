# openapi_crm.api.TeamTicketsListAssignmentTeamMemberCandidatesApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**listAssignmentTeamMemberCandidates**](TeamTicketsListAssignmentTeamMemberCandidatesApi.md#) | **GET** /crm/tickets/{id}/assignment-candidates/members | 


# **listAssignmentTeamMemberCandidates**
> ApiResponseListAssignmentTeamMemberCandidateResponse listAssignmentTeamMemberCandidates(id, teamId, start, end, sort, order, query)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamTicketsListAssignmentTeamMemberCandidatesApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final teamId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final start = 56; // int | 
final end = 56; // int | 
final sort = sort_example; // String | 
final order = order_example; // String | 
final query = query_example; // String | 

try {
    final result = api_instance.listAssignmentTeamMemberCandidates(id, teamId, start, end, sort, order, query);
    print(result);
} catch (e) {
    print('Exception when calling TeamTicketsListAssignmentTeamMemberCandidatesApi->listAssignmentTeamMemberCandidates: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **teamId** | **String**|  | 
 **start** | **int**|  | [optional] [default to 0]
 **end** | **int**|  | [optional] [default to 10]
 **sort** | **String**|  | [optional] [default to 'joinedAt']
 **order** | **String**|  | [optional] [default to 'ASC']
 **query** | **String**|  | [optional] 

### Return type

[**ApiResponseListAssignmentTeamMemberCandidateResponse**](ApiResponseListAssignmentTeamMemberCandidateResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

