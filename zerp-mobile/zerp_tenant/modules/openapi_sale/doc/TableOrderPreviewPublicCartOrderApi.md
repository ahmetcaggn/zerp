# openapi_sale.api.TableOrderPreviewPublicCartOrderApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**previewPublicCartOrder**](TableOrderPreviewPublicCartOrderApi.md#) | **GET** /sale/table-orders/public-cart-orders/preview | 


# **previewPublicCartOrder**
> PublicCartOrderPreviewDTO previewPublicCartOrder(code, tableId)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = TableOrderPreviewPublicCartOrderApi();
final code = code_example; // String | 
final tableId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 

try {
    final result = api_instance.previewPublicCartOrder(code, tableId);
    print(result);
} catch (e) {
    print('Exception when calling TableOrderPreviewPublicCartOrderApi->previewPublicCartOrder: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | **String**|  | 
 **tableId** | **String**|  | 

### Return type

[**PublicCartOrderPreviewDTO**](PublicCartOrderPreviewDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

