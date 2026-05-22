# openapi_crm.api.TeamTicketsCloseTicketApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**closeTicket**](TeamTicketsCloseTicketApi.md#) | **POST** /crm/tickets/{id}/close | 


# **closeTicket**
> TicketResponse closeTicket(id)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamTicketsCloseTicketApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.closeTicket(id);
    print(result);
} catch (e) {
    print('Exception when calling TeamTicketsCloseTicketApi->closeTicket: $e\n');
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

