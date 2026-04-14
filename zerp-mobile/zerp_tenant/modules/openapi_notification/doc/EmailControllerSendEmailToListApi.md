# openapi_notification.api.EmailControllerSendEmailToListApi

## Load the API package
```dart
import 'package:openapi_notification/api.dart';
```

All URIs are relative to *http://192.168.0.103:8083*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sendEmailToList**](EmailControllerSendEmailToListApi.md#) | **POST** /notification/email/sendToList | 


# **sendEmailToList**
> Object sendEmailToList(emailListRequestDto)



### Example
```dart
import 'package:openapi_notification/api.dart';

final api_instance = EmailControllerSendEmailToListApi();
final emailListRequestDto = EmailListRequestDto(); // EmailListRequestDto | 

try {
    final result = api_instance.sendEmailToList(emailListRequestDto);
    print(result);
} catch (e) {
    print('Exception when calling EmailControllerSendEmailToListApi->sendEmailToList: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **emailListRequestDto** | [**EmailListRequestDto**](EmailListRequestDto.md)|  | 

### Return type

[**Object**](Object.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

