# openapi_crm.api.TeamTicketsUnassignTicketApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.106:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**unassignTicket**](TeamTicketsUnassignTicketApi.md#) | **DELETE** /crm/tickets/{id}/assign | 


# **unassignTicket**
> TicketResponse unassignTicket(id)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamTicketsUnassignTicketApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.unassignTicket(id);
    print(result);
} catch (e) {
    print('Exception when calling TeamTicketsUnassignTicketApi->unassignTicket: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

