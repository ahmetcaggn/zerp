# openapi_employee.api.EmployeesGetDeletedEmployeesApi

## Load the API package
```dart
import 'package:openapi_employee/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getDeletedEmployees**](EmployeesGetDeletedEmployeesApi.md#) | **GET** /employee/deleted | 


# **getDeletedEmployees**
> ApiResponseListEmployeeListResponseDto getDeletedEmployees()



### Example
```dart
import 'package:openapi_employee/api.dart';

final api_instance = EmployeesGetDeletedEmployeesApi();

try {
    final result = api_instance.getDeletedEmployees();
    print(result);
} catch (e) {
    print('Exception when calling EmployeesGetDeletedEmployeesApi->getDeletedEmployees: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResponseListEmployeeListResponseDto**](ApiResponseListEmployeeListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

