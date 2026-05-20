# openapi_sale.api.PublicSaleGetShopsApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getShops**](PublicSaleGetShopsApi.md#) | **GET** /sale/public/shops | 


# **getShops**
> ApiResponseListPublicShopDTO getShops()



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = PublicSaleGetShopsApi();

try {
    final result = api_instance.getShops();
    print(result);
} catch (e) {
    print('Exception when calling PublicSaleGetShopsApi->getShops: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResponseListPublicShopDTO**](ApiResponseListPublicShopDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

