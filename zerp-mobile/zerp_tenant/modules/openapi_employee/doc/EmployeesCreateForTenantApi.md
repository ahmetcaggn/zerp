# openapi_employee.api.EmployeesCreateForTenantApi

## Load the API package
```dart
import 'package:openapi_employee/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createForTenant**](EmployeesCreateForTenantApi.md#) | **POST** /employee/admin | 


# **createForTenant**
> ApiResponseEmployeeResponseDto createForTenant(adminCreateEmployeeRequestDto)



### Example
```dart
import 'package:openapi_employee/api.dart';

final api_instance = EmployeesCreateForTenantApi();
final adminCreateEmployeeRequestDto = AdminCreateEmployeeRequestDto(); // AdminCreateEmployeeRequestDto | 

try {
    final result = api_instance.createForTenant(adminCreateEmployeeRequestDto);
    print(result);
} catch (e) {
    print('Exception when calling EmployeesCreateForTenantApi->createForTenant: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **adminCreateEmployeeRequestDto** | [**AdminCreateEmployeeRequestDto**](AdminCreateEmployeeRequestDto.md)|  | 

### Return type

[**ApiResponseEmployeeResponseDto**](ApiResponseEmployeeResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

