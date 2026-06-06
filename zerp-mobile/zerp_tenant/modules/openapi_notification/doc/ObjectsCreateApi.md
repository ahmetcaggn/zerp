# openapi_notification.api.ObjectsCreateApi

## Load the API package
```dart
import 'package:openapi_notification/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create**](ObjectsCreateApi.md#) | **POST** /notification/announcements | Create: Create a new entity


# **create**
> ApiResponseAnnouncementResponseDto create(createAnnouncementRequestDto)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_notification/api.dart';

final api_instance = ObjectsCreateApi();
final createAnnouncementRequestDto = CreateAnnouncementRequestDto(); // CreateAnnouncementRequestDto | 

try {
    final result = api_instance.create(createAnnouncementRequestDto);
    print(result);
} catch (e) {
    print('Exception when calling ObjectsCreateApi->create: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createAnnouncementRequestDto** | [**CreateAnnouncementRequestDto**](CreateAnnouncementRequestDto.md)|  | 

### Return type

[**ApiResponseAnnouncementResponseDto**](ApiResponseAnnouncementResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

