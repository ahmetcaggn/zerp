# openapi_crm.api.TicketsAddTicketCommentApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.103:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addTicketComment**](TicketsAddTicketCommentApi.md#) | **POST** /api/tickets/{id}/comments | 


# **addTicketComment**
> TicketResponse addTicketComment(id, addCommentRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TicketsAddTicketCommentApi();
final id = 56; // int | 
final addCommentRequest = AddCommentRequest(); // AddCommentRequest | 

try {
    final result = api_instance.addTicketComment(id, addCommentRequest);
    print(result);
} catch (e) {
    print('Exception when calling TicketsAddTicketCommentApi->addTicketComment: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **addCommentRequest** | [**AddCommentRequest**](AddCommentRequest.md)|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

