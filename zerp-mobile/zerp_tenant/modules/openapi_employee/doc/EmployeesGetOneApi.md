# openapi_employee.api.EmployeesGetOneApi

## Load the API package
```dart
import 'package:openapi_employee/api.dart';
```

All URIs are relative to *http://192.168.0.103:8082*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getOne**](EmployeesGetOneApi.md#) | **GET** /employee/{id} | GetOne: Get single entity by ID


# **getOne**
> ApiResponseEmployeeResponseDto getOne(id)

GetOne: Get single entity by ID

Retrieves a single entity by its unique identifier. Implements ra-spring-data-provider's getOne operation. 

### Example
```dart
import 'package:openapi_employee/api.dart';

final api_instance = EmployeesGetOneApi();
final id = 1; // int | Unique identifier of the entity to retrieve

try {
    final result = api_instance.getOne(id);
    print(result);
} catch (e) {
    print('Exception when calling EmployeesGetOneApi->getOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| Unique identifier of the entity to retrieve | 

### Return type

[**ApiResponseEmployeeResponseDto**](ApiResponseEmployeeResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

