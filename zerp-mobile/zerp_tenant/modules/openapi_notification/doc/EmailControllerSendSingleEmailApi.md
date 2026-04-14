# openapi_notification.api.EmailControllerSendSingleEmailApi

## Load the API package
```dart
import 'package:openapi_notification/api.dart';
```

All URIs are relative to *http://192.168.0.103:8083*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sendSingleEmail**](EmailControllerSendSingleEmailApi.md#) | **POST** /notification/email/sendSingle | 


# **sendSingleEmail**
> Object sendSingleEmail(emailSingleRequestDto)



### Example
```dart
import 'package:openapi_notification/api.dart';

final api_instance = EmailControllerSendSingleEmailApi();
final emailSingleRequestDto = EmailSingleRequestDto(); // EmailSingleRequestDto | 

try {
    final result = api_instance.sendSingleEmail(emailSingleRequestDto);
    print(result);
} catch (e) {
    print('Exception when calling EmailControllerSendSingleEmailApi->sendSingleEmail: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **emailSingleRequestDto** | [**EmailSingleRequestDto**](EmailSingleRequestDto.md)|  | 

### Return type

[**Object**](Object.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

