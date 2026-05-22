# openapi_sale.api.AdminShopsCreateAdminShopApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAdminShop**](AdminShopsCreateAdminShopApi.md#) | **POST** /sale/admin/shops | Create: Create a new entity


# **createAdminShop**
> ApiResponseAdminShopResponseDTO createAdminShop(adminShopCreateRequestDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = AdminShopsCreateAdminShopApi();
final adminShopCreateRequestDTO = AdminShopCreateRequestDTO(); // AdminShopCreateRequestDTO | 

try {
    final result = api_instance.createAdminShop(adminShopCreateRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling AdminShopsCreateAdminShopApi->createAdminShop: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **adminShopCreateRequestDTO** | [**AdminShopCreateRequestDTO**](AdminShopCreateRequestDTO.md)|  | 

### Return type

[**ApiResponseAdminShopResponseDTO**](ApiResponseAdminShopResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

