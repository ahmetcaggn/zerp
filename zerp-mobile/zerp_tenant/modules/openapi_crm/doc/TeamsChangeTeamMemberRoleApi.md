# openapi_crm.api.TeamsChangeTeamMemberRoleApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**changeTeamMemberRole**](TeamsChangeTeamMemberRoleApi.md#) | **PATCH** /crm/teams/{id}/members/{userId}/role | 


# **changeTeamMemberRole**
> TeamResponse changeTeamMemberRole(id, userId, changeMemberRoleRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamsChangeTeamMemberRoleApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final userId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final changeMemberRoleRequest = ChangeMemberRoleRequest(); // ChangeMemberRoleRequest | 

try {
    final result = api_instance.changeTeamMemberRole(id, userId, changeMemberRoleRequest);
    print(result);
} catch (e) {
    print('Exception when calling TeamsChangeTeamMemberRoleApi->changeTeamMemberRole: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **userId** | **String**|  | 
 **changeMemberRoleRequest** | [**ChangeMemberRoleRequest**](ChangeMemberRoleRequest.md)|  | 

### Return type

[**TeamResponse**](TeamResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

