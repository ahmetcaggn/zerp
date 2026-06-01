# openapi_user.api.AdminTenantsGetTenantImageApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTenantImage**](AdminTenantsGetTenantImageApi.md#) | **GET** /user/tenants/{id}/image | 


# **getTenantImage**
> MultipartFileSchema getTenantImage(id)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = AdminTenantsGetTenantImageApi();
final id = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.getTenantImage(id);
    print(result);
} catch (e) {
    print('Exception when calling AdminTenantsGetTenantImageApi->getTenantImage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**MultipartFileSchema**](MultipartFileSchema.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

