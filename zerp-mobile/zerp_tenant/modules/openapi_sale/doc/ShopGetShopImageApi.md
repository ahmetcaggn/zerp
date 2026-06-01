# openapi_sale.api.ShopGetShopImageApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getShopImage**](ShopGetShopImageApi.md#) | **GET** /sale/shops/{shopId}/image | 


# **getShopImage**
> MultipartFileSchema getShopImage(shopId, size)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ShopGetShopImageApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final size = size_example; // String | 

try {
    final result = api_instance.getShopImage(shopId, size);
    print(result);
} catch (e) {
    print('Exception when calling ShopGetShopImageApi->getShopImage: $e\n');
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

