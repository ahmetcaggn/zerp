# openapi_employee.api.EmployeesGetDeletedEmployeesPaginatedApi

## Load the API package
```dart
import 'package:openapi_employee/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getDeletedEmployeesPaginated**](EmployeesGetDeletedEmployeesPaginatedApi.md#) | **GET** /employee/deleted/paginated | 


# **getDeletedEmployeesPaginated**
> ApiResponsePageEmployeeListResponseDto getDeletedEmployeesPaginated(pageable)



### Example
```dart
import 'package:openapi_employee/api.dart';

final api_instance = EmployeesGetDeletedEmployeesPaginatedApi();
final pageable = ; // Pageable | 

try {
    final result = api_instance.getDeletedEmployeesPaginated(pageable);
    print(result);
} catch (e) {
    print('Exception when calling EmployeesGetDeletedEmployeesPaginatedApi->getDeletedEmployeesPaginated: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageable** | [**Pageable**](.md)|  | 

### Return type

[**ApiResponsePageEmployeeListResponseDto**](ApiResponsePageEmployeeListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

