# openapi_sale.api.PublicSaleGetShopsFeedApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getShopsFeed**](PublicSaleGetShopsFeedApi.md#) | **GET** /sale/public/shops/feed | 


# **getShopsFeed**
> ApiResponsePublicShopFeedResponseDTO getShopsFeed(mode, page, pageSize, q, city, state, cuisineCategory, cuisineCategories, sortBy, order, lat, lng)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = PublicSaleGetShopsFeedApi();
final mode = mode_example; // String | 
final page = 56; // int | 
final pageSize = 56; // int | 
final q = q_example; // String | 
final city = city_example; // String | 
final state = state_example; // String | 
final cuisineCategory = cuisineCategory_example; // String | 
final cuisineCategories = []; // List<String> | 
final sortBy = sortBy_example; // String | 
final order = order_example; // String | 
final lat = 1.2; // double | 
final lng = 1.2; // double | 

try {
    final result = api_instance.getShopsFeed(mode, page, pageSize, q, city, state, cuisineCategory, cuisineCategories, sortBy, order, lat, lng);
    print(result);
} catch (e) {
    print('Exception when calling PublicSaleGetShopsFeedApi->getShopsFeed: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mode** | **String**|  | [optional] [default to 'ALL']
 **page** | **int**|  | [optional] [default to 1]
 **pageSize** | **int**|  | [optional] [default to 12]
 **q** | **String**|  | [optional] 
 **city** | **String**|  | [optional] 
 **state** | **String**|  | [optional] 
 **cuisineCategory** | **String**|  | [optional] 
 **cuisineCategories** | [**List<String>**](String.md)|  | [optional] [default to const []]
 **sortBy** | **String**|  | [optional] 
 **order** | **String**|  | [optional] 
 **lat** | **double**|  | [optional] 
 **lng** | **double**|  | [optional] 

### Return type

[**ApiResponsePublicShopFeedResponseDTO**](ApiResponsePublicShopFeedResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

