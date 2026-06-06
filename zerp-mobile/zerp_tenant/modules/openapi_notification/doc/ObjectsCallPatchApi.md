# openapi_notification.api.ObjectsCallPatchApi

## Load the API package
```dart
import 'package:openapi_notification/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callPatch**](ObjectsCallPatchApi.md#) | **PATCH** /notification/announcements/{id} | Update: Update an existing entity


# **callPatch**
> ApiResponseAnnouncementResponseDto callPatch(id, requestBody)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_notification/api.dart';

final api_instance = ObjectsCallPatchApi();
final id = 1; // String | Unique identifier of the entity to update
final requestBody = Map<String, Object>(); // Map<String, Object> | 

try {
    final result = api_instance.callPatch(id, requestBody);
    print(result);
} catch (e) {
    print('Exception when calling ObjectsCallPatchApi->callPatch: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **requestBody** | [**Map<String, Object>**](Object.md)|  | 

### Return type

[**ApiResponseAnnouncementResponseDto**](ApiResponseAnnouncementResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

