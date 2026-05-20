# openapi_crm.api.TicketAttachmentsGetTicketAttachmentApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTicketAttachment**](TicketAttachmentsGetTicketAttachmentApi.md#) | **GET** /crm/tickets/{id}/attachments/{attachmentId} | 


# **getTicketAttachment**
> MultipartFileSchema getTicketAttachment(id, attachmentId)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TicketAttachmentsGetTicketAttachmentApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final attachmentId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.getTicketAttachment(id, attachmentId);
    print(result);
} catch (e) {
    print('Exception when calling TicketAttachmentsGetTicketAttachmentApi->getTicketAttachment: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **attachmentId** | **String**|  | 

### Return type

[**MultipartFileSchema**](MultipartFileSchema.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

