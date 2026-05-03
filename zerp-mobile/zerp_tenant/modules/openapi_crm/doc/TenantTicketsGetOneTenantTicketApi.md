# openapi_crm.api.TenantTicketsGetOneTenantTicketApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *http://192.168.0.106:8081*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getOneTenantTicket**](TenantTicketsGetOneTenantTicketApi.md#) | **GET** /crm/tickets/{id} | GetOne: Get single entity by ID


# **getOneTenantTicket**
> ApiResponseTicketResponse getOneTenantTicket(id)

GetOne: Get single entity by ID

Retrieves a single entity by its unique identifier. Implements ra-spring-data-provider's getOne operation. 

### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TenantTicketsGetOneTenantTicketApi();
final id = 1; // String | Unique identifier of the entity to retrieve

try {
    final result = api_instance.getOneTenantTicket(id);
    print(result);
} catch (e) {
    print('Exception when calling TenantTicketsGetOneTenantTicketApi->getOneTenantTicket: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to retrieve | 

### Return type

[**ApiResponseTicketResponse**](ApiResponseTicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

