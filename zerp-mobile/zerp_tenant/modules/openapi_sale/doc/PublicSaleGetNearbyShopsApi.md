# openapi_sale.api.PublicSaleGetNearbyShopsApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getNearbyShops**](PublicSaleGetNearbyShopsApi.md#) | **GET** /sale/public/shops/nearby | 


# **getNearbyShops**
> ApiResponseListPublicShopDTO getNearbyShops(lat, lng, start, end, limit)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = PublicSaleGetNearbyShopsApi();
final lat = 1.2; // double | 
final lng = 1.2; // double | 
final start = 56; // int | 
final end = 56; // int | 
final limit = 56; // int | 

try {
    final result = api_instance.getNearbyShops(lat, lng, start, end, limit);
    print(result);
} catch (e) {
    print('Exception when calling PublicSaleGetNearbyShopsApi->getNearbyShops: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **lat** | **double**|  | 
 **lng** | **double**|  | 
 **start** | **int**|  | [optional] [default to 0]
 **end** | **int**|  | [optional] 
 **limit** | **int**|  | [optional] [default to 10]

### Return type

[**ApiResponseListPublicShopDTO**](ApiResponseListPublicShopDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

