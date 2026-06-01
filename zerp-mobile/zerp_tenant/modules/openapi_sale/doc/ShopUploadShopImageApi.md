# openapi_sale.api.ShopUploadShopImageApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**uploadShopImage**](ShopUploadShopImageApi.md#) | **POST** /sale/shops/{shopId}/image | 


# **uploadShopImage**
> ShopImageUploadResponseDTO uploadShopImage(shopId, file)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ShopUploadShopImageApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final file = BINARY_DATA_HERE; // MultipartFileSchema | 

try {
    final result = api_instance.uploadShopImage(shopId, file);
    print(result);
} catch (e) {
    print('Exception when calling ShopUploadShopImageApi->uploadShopImage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 
 **file** | **MultipartFileSchema**|  | 

### Return type

[**ShopImageUploadResponseDTO**](ShopImageUploadResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

