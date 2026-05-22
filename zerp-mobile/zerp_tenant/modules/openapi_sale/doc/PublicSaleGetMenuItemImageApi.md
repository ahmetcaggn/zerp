# openapi_sale.api.PublicSaleGetMenuItemImageApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getMenuItemImage**](PublicSaleGetMenuItemImageApi.md#) | **GET** /sale/public/images/{imageId} | 


# **getMenuItemImage**
> MultipartFileSchema getMenuItemImage(imageId, size)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = PublicSaleGetMenuItemImageApi();
final imageId = imageId_example; // String | 
final size = size_example; // String | 

try {
    final result = api_instance.getMenuItemImage(imageId, size);
    print(result);
} catch (e) {
    print('Exception when calling PublicSaleGetMenuItemImageApi->getMenuItemImage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **imageId** | **String**|  | 
 **size** | **String**|  | [optional] 

### Return type

[**MultipartFileSchema**](MultipartFileSchema.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

