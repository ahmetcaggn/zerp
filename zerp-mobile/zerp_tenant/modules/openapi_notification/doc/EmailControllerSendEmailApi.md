# openapi_notification.api.EmailControllerSendEmailApi

## Load the API package
```dart
import 'package:openapi_notification/api.dart';
```

All URIs are relative to *http://192.168.0.103:8083*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sendEmail**](EmailControllerSendEmailApi.md#) | **POST** /notification/email/send | 


# **sendEmail**
> EmailEmployeeListRequestDto sendEmail(emailEmployeeListRequestDto)



### Example
```dart
import 'package:openapi_notification/api.dart';

final api_instance = EmailControllerSendEmailApi();
final emailEmployeeListRequestDto = EmailEmployeeListRequestDto(); // EmailEmployeeListRequestDto | 

try {
    final result = api_instance.sendEmail(emailEmployeeListRequestDto);
    print(result);
} catch (e) {
    print('Exception when calling EmailControllerSendEmailApi->sendEmail: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **emailEmployeeListRequestDto** | [**EmailEmployeeListRequestDto**](EmailEmployeeListRequestDto.md)|  | 

### Return type

[**EmailEmployeeListRequestDto**](EmailEmployeeListRequestDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

