# openapi_crm.api.TeamTicketsAssignTicketApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.106:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**assignTicket**](TeamTicketsAssignTicketApi.md#) | **POST** /crm/tickets/{id}/assign | 


# **assignTicket**
> TicketResponse assignTicket(id, assignTicketRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamTicketsAssignTicketApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final assignTicketRequest = AssignTicketRequest(); // AssignTicketRequest | 

try {
    final result = api_instance.assignTicket(id, assignTicketRequest);
    print(result);
} catch (e) {
    print('Exception when calling TeamTicketsAssignTicketApi->assignTicket: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **assignTicketRequest** | [**AssignTicketRequest**](AssignTicketRequest.md)|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

