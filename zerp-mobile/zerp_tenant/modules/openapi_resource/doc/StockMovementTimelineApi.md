# openapi_resource.api.StockMovementTimelineApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**timeline**](StockMovementTimelineApi.md#) | **GET** /resource/stock-movements/timeline | 


# **timeline**
> ApiResponseStockMovementTimelineDTO timeline(shopId, from, to, stockResourceId, bucket)



### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockMovementTimelineApi();
final shopId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final from = 2013-10-20T19:20:30+01:00; // DateTime | 
final to = 2013-10-20T19:20:30+01:00; // DateTime | 
final stockResourceId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final bucket = bucket_example; // String | 

try {
    final result = api_instance.timeline(shopId, from, to, stockResourceId, bucket);
    print(result);
} catch (e) {
    print('Exception when calling StockMovementTimelineApi->timeline: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shopId** | **String**|  | 
 **from** | **DateTime**|  | 
 **to** | **DateTime**|  | 
 **stockResourceId** | **String**|  | [optional] 
 **bucket** | **String**|  | [optional] [default to 'WEEK']

### Return type

[**ApiResponseStockMovementTimelineDTO**](ApiResponseStockMovementTimelineDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

