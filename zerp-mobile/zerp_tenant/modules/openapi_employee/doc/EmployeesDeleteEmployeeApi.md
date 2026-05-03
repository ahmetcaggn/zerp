# openapi_employee.api.EmployeesDeleteEmployeeApi

## Load the API package
```dart
import 'package:openapi_employee/api.dart';
```

All URIs are relative to *http://192.168.0.106:8082*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteEmployee**](EmployeesDeleteEmployeeApi.md#) | **DELETE** /employee/{id} | Delete: Delete a single entity


# **deleteEmployee**
> ApiResponseVoid deleteEmployee(id)

Delete: Delete a single entity

Deletes a single entity by its unique identifier. Implements ra-spring-data-provider's delete operation. 

### Example
```dart
import 'package:openapi_employee/api.dart';

final api_instance = EmployeesDeleteEmployeeApi();
final id = 1; // String | Unique identifier of the entity to delete

try {
    final result = api_instance.deleteEmployee(id);
    print(result);
} catch (e) {
    print('Exception when calling EmployeesDeleteEmployeeApi->deleteEmployee: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to delete | 

### Return type

[**ApiResponseVoid**](ApiResponseVoid.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

