# openapi_employee.api.EmployeesUpdateEmployeeApi

## Load the API package
```dart
import 'package:openapi_employee/api.dart';
```

All URIs are relative to *http://192.168.0.106:8082*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateEmployee**](EmployeesUpdateEmployeeApi.md#) | **PUT** /employee/{id} | Update: Update an existing entity


# **updateEmployee**
> ApiResponseEmployeeResponseDto updateEmployee(id, updateEmployeeRequestDto)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_employee/api.dart';

final api_instance = EmployeesUpdateEmployeeApi();
final id = 1; // String | Unique identifier of the entity to update
final updateEmployeeRequestDto = UpdateEmployeeRequestDto(); // UpdateEmployeeRequestDto | 

try {
    final result = api_instance.updateEmployee(id, updateEmployeeRequestDto);
    print(result);
} catch (e) {
    print('Exception when calling EmployeesUpdateEmployeeApi->updateEmployee: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **updateEmployeeRequestDto** | [**UpdateEmployeeRequestDto**](UpdateEmployeeRequestDto.md)|  | 

### Return type

[**ApiResponseEmployeeResponseDto**](ApiResponseEmployeeResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

