# openapi_crm.api.TenantTicketsCreateTenantTicketApi

## Load the API package
```dart
import 'package:openapi_crm/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTenantTicket**](TenantTicketsCreateTenantTicketApi.md#) | **POST** /crm/tickets | Create: Create a new entity


# **createTenantTicket**
> ApiResponseTicketResponse createTenantTicket(createTicketRequest)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_crm/api.dart';

final api_instance = TenantTicketsCreateTenantTicketApi();
final createTicketRequest = CreateTicketRequest(); // CreateTicketRequest | 

try {
    final result = api_instance.createTenantTicket(createTicketRequest);
    print(result);
} catch (e) {
    print('Exception when calling TenantTicketsCreateTenantTicketApi->createTenantTicket: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createTicketRequest** | [**CreateTicketRequest**](CreateTicketRequest.md)|  | 

### Return type

[**ApiResponseTicketResponse**](ApiResponseTicketResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

