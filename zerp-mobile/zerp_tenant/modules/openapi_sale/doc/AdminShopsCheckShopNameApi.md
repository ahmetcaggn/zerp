# openapi_sale.api.AdminShopsCheckShopNameApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**checkShopName**](AdminShopsCheckShopNameApi.md#) | **GET** /sale/admin/shops/check-name | 


# **checkShopName**
> ApiResponseAdminShopNameCheckResponseDTO checkShopName(tenantId, name, shopId)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = AdminShopsCheckShopNameApi();
final tenantId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final name = name_example; // String | 
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.checkShopName(tenantId, name, shopId);
    print(result);
} catch (e) {
    print('Exception when calling AdminShopsCheckShopNameApi->checkShopName: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantId** | **String**|  | 
 **name** | **String**|  | 
 **shopId** | **String**|  | [optional] 

### Return type

[**ApiResponseAdminShopNameCheckResponseDTO**](ApiResponseAdminShopNameCheckResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

