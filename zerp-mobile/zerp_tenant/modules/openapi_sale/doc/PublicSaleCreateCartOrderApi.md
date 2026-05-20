# openapi_sale.api.PublicSaleCreateCartOrderApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createCartOrder**](PublicSaleCreateCartOrderApi.md#) | **POST** /sale/public/shops/{shopId}/cart-orders | 


# **createCartOrder**
> ApiResponsePublicCartOrderCreateResponse createCartOrder(shopId, publicCartOrderCreateRequest)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = PublicSaleCreateCartOrderApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final publicCartOrderCreateRequest = PublicCartOrderCreateRequest(); // PublicCartOrderCreateRequest | 

try {
    final result = api_instance.createCartOrder(shopId, publicCartOrderCreateRequest);
    print(result);
} catch (e) {
    print('Exception when calling PublicSaleCreateCartOrderApi->createCartOrder: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 
 **publicCartOrderCreateRequest** | [**PublicCartOrderCreateRequest**](PublicCartOrderCreateRequest.md)|  | 

### Return type

[**ApiResponsePublicCartOrderCreateResponse**](ApiResponsePublicCartOrderCreateResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

