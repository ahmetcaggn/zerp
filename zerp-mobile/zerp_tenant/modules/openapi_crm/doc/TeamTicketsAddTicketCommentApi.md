# openapi_crm.api.TeamTicketsAddTicketCommentApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addTicketComment**](TeamTicketsAddTicketCommentApi.md#) | **POST** /crm/tickets/{id}/comments | 


# **addTicketComment**
> TicketResponse addTicketComment(id, addCommentRequest)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TeamTicketsAddTicketCommentApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final addCommentRequest = AddCommentRequest(); // AddCommentRequest | 

try {
    final result = api_instance.addTicketComment(id, addCommentRequest);
    print(result);
} catch (e) {
    print('Exception when calling TeamTicketsAddTicketCommentApi->addTicketComment: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **addCommentRequest** | [**AddCommentRequest**](AddCommentRequest.md)|  | 

### Return type

[**TicketResponse**](TicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

