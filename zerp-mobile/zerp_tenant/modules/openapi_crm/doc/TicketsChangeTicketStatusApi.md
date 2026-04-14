# openapi_crm.api.TicketsChangeTicketStatusApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.103:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**changeTicketStatus**](TicketsChangeTicketStatusApi.md#) | **PATCH** /api/tickets/{id}/status | 


# **changeTicketStatus**
> TicketResponse changeTicketStatus(id, changeStatusRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TicketsChangeTicketStatusApi();
final id = 56; // int | 
final changeStatusRequest = ChangeStatusRequest(); // ChangeStatusRequest | 

try {
    final result = api_instance.changeTicketStatus(id, changeStatusRequest);
    print(result);
} catch (e) {
    print('Exception when calling TicketsChangeTicketStatusApi->changeTicketStatus: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **changeStatusRequest** | [**ChangeStatusRequest**](ChangeStatusRequest.md)|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

