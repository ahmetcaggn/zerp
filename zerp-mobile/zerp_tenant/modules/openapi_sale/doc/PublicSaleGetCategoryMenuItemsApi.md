# openapi_sale.api.PublicSaleGetCategoryMenuItemsApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCategoryMenuItems**](PublicSaleGetCategoryMenuItemsApi.md#) | **GET** /sale/public/shops/{shopId}/categories/{categoryId}/menu-items | 


# **getCategoryMenuItems**
> ApiResponseListPublicMenuItemDTO getCategoryMenuItems(shopId, categoryId, language, start, end, sort, order)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = PublicSaleGetCategoryMenuItemsApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final categoryId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final language = language_example; // String | 
final start = 56; // int | 
final end = 56; // int | 
final sort = sort_example; // String | 
final order = order_example; // String | 

try {
    final result = api_instance.getCategoryMenuItems(shopId, categoryId, language, start, end, sort, order);
    print(result);
} catch (e) {
    print('Exception when calling PublicSaleGetCategoryMenuItemsApi->getCategoryMenuItems: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 
 **categoryId** | **String**|  | 
 **language** | **String**|  | [optional] 
 **start** | **int**|  | [optional] [default to 0]
 **end** | **int**|  | [optional] [default to 20]
 **sort** | **String**|  | [optional] [default to 'name']
 **order** | **String**|  | [optional] [default to 'ASC']

### Return type

[**ApiResponseListPublicMenuItemDTO**](ApiResponseListPublicMenuItemDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

