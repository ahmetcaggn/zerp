# openapi_user.api.AdminTenantsUpdateAdminTenantApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updateAdminTenant**](AdminTenantsUpdateAdminTenantApi.md#) | **PUT** /user/tenants/{id} | Update: Update an existing entity


# **updateAdminTenant**
> ApiResponseTenantResponseDTO updateAdminTenant(id, tenantUpdateRequestDTO)

Update: Update an existing entity

Updates an existing entity with the provided field values. Implements ra-spring-data-provider's update operation with support for partial updates. Only the fields provided in the request body will be updated. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = AdminTenantsUpdateAdminTenantApi();
final id = 1; // String | Unique identifier of the entity to update
final tenantUpdateRequestDTO = TenantUpdateRequestDTO(); // TenantUpdateRequestDTO | 

try {
    final result = api_instance.updateAdminTenant(id, tenantUpdateRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling AdminTenantsUpdateAdminTenantApi->updateAdminTenant: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Unique identifier of the entity to update | 
 **tenantUpdateRequestDTO** | [**TenantUpdateRequestDTO**](TenantUpdateRequestDTO.md)|  | 

### Return type

[**ApiResponseTenantResponseDTO**](ApiResponseTenantResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

