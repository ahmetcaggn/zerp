# openapi_crm.api.TeamTicketsListAssignmentTeamCandidatesApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**listAssignmentTeamCandidates**](TeamTicketsListAssignmentTeamCandidatesApi.md#) | **GET** /crm/tickets/{id}/assignment-candidates/teams | 


# **listAssignmentTeamCandidates**
> ApiResponseListAssignmentTeamCandidateResponse listAssignmentTeamCandidates(id, start, end, sort, order, query)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamTicketsListAssignmentTeamCandidatesApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final start = 56; // int | 
final end = 56; // int | 
final sort = sort_example; // String | 
final order = order_example; // String | 
final query = query_example; // String | 

try {
    final result = api_instance.listAssignmentTeamCandidates(id, start, end, sort, order, query);
    print(result);
} catch (e) {
    print('Exception when calling TeamTicketsListAssignmentTeamCandidatesApi->listAssignmentTeamCandidates: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **start** | **int**|  | [optional] [default to 0]
 **end** | **int**|  | [optional] [default to 10]
 **sort** | **String**|  | [optional] [default to 'name']
 **order** | **String**|  | [optional] [default to 'ASC']
 **query** | **String**|  | [optional] 

### Return type

[**ApiResponseListAssignmentTeamCandidateResponse**](ApiResponseListAssignmentTeamCandidateResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

