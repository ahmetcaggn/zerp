# openapi_crm.api.TicketsCreateTicketApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.112:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTicket**](TicketsCreateTicketApi.md#) | **POST** /api/tickets | 


# **createTicket**
> TicketResponse createTicket(createTicketRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TicketsCreateTicketApi();
final createTicketRequest = CreateTicketRequest(); // CreateTicketRequest | 

try {
    final result = api_instance.createTicket(createTicketRequest);
    print(result);
} catch (e) {
    print('Exception when calling TicketsCreateTicketApi->createTicket: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createTicketRequest** | [**CreateTicketRequest**](CreateTicketRequest.md)|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

