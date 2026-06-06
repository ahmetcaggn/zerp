# openapi_notification.api.EmailControllerSendEmailToListWithHtmlApi

## Load the API package
```dart
import 'package:openapi_notification/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sendEmailToListWithHtml**](EmailControllerSendEmailToListWithHtmlApi.md#) | **POST** /notification/email/sendToListHtml | 


# **sendEmailToListWithHtml**
> Object sendEmailToListWithHtml(emailListHtmlRequestDto)



### Example
```dart
import 'package:openapi_notification/api.dart';

final api_instance = EmailControllerSendEmailToListWithHtmlApi();
final emailListHtmlRequestDto = EmailListHtmlRequestDto(); // EmailListHtmlRequestDto | 

try {
    final result = api_instance.sendEmailToListWithHtml(emailListHtmlRequestDto);
    print(result);
} catch (e) {
    print('Exception when calling EmailControllerSendEmailToListWithHtmlApi->sendEmailToListWithHtml: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **emailListHtmlRequestDto** | [**EmailListHtmlRequestDto**](EmailListHtmlRequestDto.md)|  | 

### Return type

[**Object**](Object.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

