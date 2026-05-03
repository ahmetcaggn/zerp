# openapi_crm.api.TenantTicketsPatchTenantTicketApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.106:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**patchTenantTicket**](TenantTicketsPatchTenantTicketApi.md#) | **PATCH** /crm/tickets/{id} | Update: Update an existing entity


# **patchTenantTicket**
> ApiResponseTicketResponse patchTenantTicket(id, requestBody)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TenantTicketsPatchTenantTicketApi();
final id = 1; // String | Unique identifier of the entity to update
final requestBody = Map<String, Object>(); // Map<String, Object> | 

try {
    final result = api_instance.patchTenantTicket(id, requestBody);
    print(result);
} catch (e) {
    print('Exception when calling TenantTicketsPatchTenantTicketApi->patchTenantTicket: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **requestBody** | [**Map<String, Object>**](Object.md)|  | 

### Return type

[**ApiResponseTicketResponse**](ApiResponseTicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

