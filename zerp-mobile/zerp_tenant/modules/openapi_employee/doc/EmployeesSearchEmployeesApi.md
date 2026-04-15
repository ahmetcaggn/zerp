# openapi_employee.api.EmployeesSearchEmployeesApi

## Load the API package
```dart
import 'package:openapi_employee/api.dart';
```

All URIs are relative to *http://192.168.0.112:8082*

Method | HTTP request | Description
------------- | ------------- | -------------
[**searchEmployees**](EmployeesSearchEmployeesApi.md#) | **GET** /employee/search | 


# **searchEmployees**
> ApiResponsePageEmployeeListResponseDto searchEmployees(keyword, pageable)



### Example
```dart
import 'package:openapi_employee/api.dart';

final api_instance = EmployeesSearchEmployeesApi();
final keyword = keyword_example; // String | 
final pageable = ; // Pageable | 

try {
    final result = api_instance.searchEmployees(keyword, pageable);
    print(result);
} catch (e) {
    print('Exception when calling EmployeesSearchEmployeesApi->searchEmployees: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | **String**|  | 
 **pageable** | [**Pageable**](.md)|  | 

### Return type

[**ApiResponsePageEmployeeListResponseDto**](ApiResponsePageEmployeeListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

