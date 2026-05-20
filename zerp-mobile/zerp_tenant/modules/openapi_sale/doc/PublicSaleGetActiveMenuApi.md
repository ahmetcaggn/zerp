# openapi_sale.api.PublicSaleGetActiveMenuApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getActiveMenu**](PublicSaleGetActiveMenuApi.md#) | **GET** /sale/public/shops/{shopId}/menu | 


# **getActiveMenu**
> ApiResponsePublicShopMenuResponseDTO getActiveMenu(shopId, language)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = PublicSaleGetActiveMenuApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final language = language_example; // String | 

try {
    final result = api_instance.getActiveMenu(shopId, language);
    print(result);
} catch (e) {
    print('Exception when calling PublicSaleGetActiveMenuApi->getActiveMenu: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 
 **language** | **String**|  | [optional] 

### Return type

[**ApiResponsePublicShopMenuResponseDTO**](ApiResponsePublicShopMenuResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

