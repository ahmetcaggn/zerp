# openapi_user.api.AdminTenantsCreateAdminTenantApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAdminTenant**](AdminTenantsCreateAdminTenantApi.md#) | **POST** /user/tenants | Create: Create a new entity


# **createAdminTenant**
> ApiResponseTenantResponseDTO createAdminTenant(tenantCreateRequestDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = AdminTenantsCreateAdminTenantApi();
final tenantCreateRequestDTO = TenantCreateRequestDTO(); // TenantCreateRequestDTO | 

try {
    final result = api_instance.createAdminTenant(tenantCreateRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling AdminTenantsCreateAdminTenantApi->createAdminTenant: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantCreateRequestDTO** | [**TenantCreateRequestDTO**](TenantCreateRequestDTO.md)|  | 

### Return type

[**ApiResponseTenantResponseDTO**](ApiResponseTenantResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

