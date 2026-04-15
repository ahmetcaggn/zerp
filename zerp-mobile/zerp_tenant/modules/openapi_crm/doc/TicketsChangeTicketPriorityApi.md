# openapi_crm.api.TicketsChangeTicketPriorityApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.112:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**changeTicketPriority**](TicketsChangeTicketPriorityApi.md#) | **PATCH** /api/tickets/{id}/priority | 


# **changeTicketPriority**
> TicketResponse changeTicketPriority(id, changePriorityRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TicketsChangeTicketPriorityApi();
final id = 56; // int | 
final changePriorityRequest = ChangePriorityRequest(); // ChangePriorityRequest | 

try {
    final result = api_instance.changeTicketPriority(id, changePriorityRequest);
    print(result);
} catch (e) {
    print('Exception when calling TicketsChangeTicketPriorityApi->changeTicketPriority: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **changePriorityRequest** | [**ChangePriorityRequest**](ChangePriorityRequest.md)|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

