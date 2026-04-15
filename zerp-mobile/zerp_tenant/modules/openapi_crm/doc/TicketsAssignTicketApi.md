# openapi_crm.api.TicketsAssignTicketApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.112:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**assignTicket**](TicketsAssignTicketApi.md#) | **POST** /api/tickets/{id}/assign | 


# **assignTicket**
> TicketResponse assignTicket(id, assignTicketRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TicketsAssignTicketApi();
final id = 56; // int | 
final assignTicketRequest = AssignTicketRequest(); // AssignTicketRequest | 

try {
    final result = api_instance.assignTicket(id, assignTicketRequest);
    print(result);
} catch (e) {
    print('Exception when calling TicketsAssignTicketApi->assignTicket: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **assignTicketRequest** | [**AssignTicketRequest**](AssignTicketRequest.md)|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

