# openapi_employee.api.EmployeesCreateEmployeeApi

## Load the API package
```dart
import 'package:openapi_employee/api.dart';
```

All URIs are relative to *http://192.168.0.112:8082*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createEmployee**](EmployeesCreateEmployeeApi.md#) | **POST** /employee | Create: Create a new entity


# **createEmployee**
> ApiResponseEmployeeResponseDto createEmployee(createEmployeeRequestDto)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_employee/api.dart';

final api_instance = EmployeesCreateEmployeeApi();
final createEmployeeRequestDto = CreateEmployeeRequestDto(); // CreateEmployeeRequestDto | 

try {
    final result = api_instance.createEmployee(createEmployeeRequestDto);
    print(result);
} catch (e) {
    print('Exception when calling EmployeesCreateEmployeeApi->createEmployee: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createEmployeeRequestDto** | [**CreateEmployeeRequestDto**](CreateEmployeeRequestDto.md)|  | 

### Return type

[**ApiResponseEmployeeResponseDto**](ApiResponseEmployeeResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

