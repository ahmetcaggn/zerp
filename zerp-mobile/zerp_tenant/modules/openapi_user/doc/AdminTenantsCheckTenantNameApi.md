# openapi_user.api.AdminTenantsCheckTenantNameApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**checkTenantName**](AdminTenantsCheckTenantNameApi.md#) | **GET** /user/tenants/check-name | 


# **checkTenantName**
> ApiResponseTenantNameCheckResponseDTO checkTenantName(name)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = AdminTenantsCheckTenantNameApi();
final name = name_example; // String | 

try {
    final result = api_instance.checkTenantName(name);
    print(result);
} catch (e) {
    print('Exception when calling AdminTenantsCheckTenantNameApi->checkTenantName: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **String**|  | 

### Return type

[**ApiResponseTenantNameCheckResponseDTO**](ApiResponseTenantNameCheckResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

