# openapi_crm.api.TicketsGetTicketApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.103:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTicket**](TicketsGetTicketApi.md#) | **GET** /api/tickets/{id} | 


# **getTicket**
> TicketResponse getTicket(id)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TicketsGetTicketApi();
final id = 56; // int | 

try {
    final result = api_instance.getTicket(id);
    print(result);
} catch (e) {
    print('Exception when calling TicketsGetTicketApi->getTicket: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

