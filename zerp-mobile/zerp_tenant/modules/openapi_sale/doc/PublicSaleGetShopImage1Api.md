# openapi_sale.api.PublicSaleGetShopImage1Api

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getShopImage1**](PublicSaleGetShopImage1Api.md#) | **GET** /sale/public/shops/{shopId}/image | 


# **getShopImage1**
> MultipartFileSchema getShopImage1(shopId, size)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = PublicSaleGetShopImage1Api();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final size = size_example; // String | 

try {
    final result = api_instance.getShopImage1(shopId, size);
    print(result);
} catch (e) {
    print('Exception when calling PublicSaleGetShopImage1Api->getShopImage1: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 
 **size** | **String**|  | [optional] 

### Return type

[**MultipartFileSchema**](MultipartFileSchema.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

