# openapi_resource.api.StockOperationCreateAdjustmentApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAdjustment**](StockOperationCreateAdjustmentApi.md#) | **POST** /resource/stock-operations/adjustments | 


# **createAdjustment**
> ApiResponseStockOperationDTO createAdjustment(stockAdjustmentCreateDTO)



### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockOperationCreateAdjustmentApi();
final stockAdjustmentCreateDTO = StockAdjustmentCreateDTO(); // StockAdjustmentCreateDTO | 

try {
    final result = api_instance.createAdjustment(stockAdjustmentCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling StockOperationCreateAdjustmentApi->createAdjustment: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **stockAdjustmentCreateDTO** | [**StockAdjustmentCreateDTO**](StockAdjustmentCreateDTO.md)|  | 

### Return type

[**ApiResponseStockOperationDTO**](ApiResponseStockOperationDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

