# openapi_crm.api.TicketAttachmentsUploadTicketAttachmentApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**uploadTicketAttachment**](TicketAttachmentsUploadTicketAttachmentApi.md#) | **POST** /crm/tickets/{id}/attachments | 


# **uploadTicketAttachment**
> AttachmentResponse uploadTicketAttachment(id, file)



### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TicketAttachmentsUploadTicketAttachmentApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final file = BINARY_DATA_HERE; // MultipartFileSchema | 

try {
    final result = api_instance.uploadTicketAttachment(id, file);
    print(result);
} catch (e) {
    print('Exception when calling TicketAttachmentsUploadTicketAttachmentApi->uploadTicketAttachment: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **file** | **MultipartFileSchema**|  | 

### Return type

[**AttachmentResponse**](AttachmentResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

