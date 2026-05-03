# openapi_employee.api.EmployeesGetOneEmployeeApi

## Load the API package
```dart
import 'package:openapi_employee/api.dart';
```

All URIs are relative to *http://192.168.0.106:8082*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getOneEmployee**](EmployeesGetOneEmployeeApi.md#) | **GET** /employee/{id} | GetOne: Get single entity by ID


# **getOneEmployee**
> ApiResponseEmployeeResponseDto getOneEmployee(id)

GetOne: Get single entity by ID

Retrieves a single entity by its unique identifier. Implements ra-spring-data-provider's getOne operation. 

### Example
```dart
import 'package:openapi_employee/api.dart';

final api_instance = EmployeesGetOneEmployeeApi();
final id = 1; // String | Unique identifier of the entity to retrieve

try {
    final result = api_instance.getOneEmployee(id);
    print(result);
} catch (e) {
    print('Exception when calling EmployeesGetOneEmployeeApi->getOneEmployee: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to retrieve | 

### Return type

[**ApiResponseEmployeeResponseDto**](ApiResponseEmployeeResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

