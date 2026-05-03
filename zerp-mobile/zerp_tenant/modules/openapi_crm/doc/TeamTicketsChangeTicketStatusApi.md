# openapi_crm.api.TeamTicketsChangeTicketStatusApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.106:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**changeTicketStatus**](TeamTicketsChangeTicketStatusApi.md#) | **PATCH** /crm/tickets/{id}/status | 


# **changeTicketStatus**
> TicketResponse changeTicketStatus(id, changeStatusRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamTicketsChangeTicketStatusApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final changeStatusRequest = ChangeStatusRequest(); // ChangeStatusRequest | 

try {
    final result = api_instance.changeTicketStatus(id, changeStatusRequest);
    print(result);
} catch (e) {
    print('Exception when calling TeamTicketsChangeTicketStatusApi->changeTicketStatus: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **changeStatusRequest** | [**ChangeStatusRequest**](ChangeStatusRequest.md)|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

