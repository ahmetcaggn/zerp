# openapi_user.api.AdminTenantsUploadTenantImageApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**uploadTenantImage**](AdminTenantsUploadTenantImageApi.md#) | **POST** /user/tenants/{id}/image | 


# **uploadTenantImage**
> ApiResponseTenantImageUploadResponseDTO uploadTenantImage(id, file)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = AdminTenantsUploadTenantImageApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final file = BINARY_DATA_HERE; // MultipartFileSchema | 

try {
    final result = api_instance.uploadTenantImage(id, file);
    print(result);
} catch (e) {
    print('Exception when calling AdminTenantsUploadTenantImageApi->uploadTenantImage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **file** | **MultipartFileSchema**|  | 

### Return type

[**ApiResponseTenantImageUploadResponseDTO**](ApiResponseTenantImageUploadResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

