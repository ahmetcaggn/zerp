# openapi_resource.api.StockCountCreateStockCountApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createStockCount**](StockCountCreateStockCountApi.md#) | **POST** /resource/stock-counts | Create: Create a new entity


# **createStockCount**
> ApiResponseStockCountDTO createStockCount(stockCountCreateDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockCountCreateStockCountApi();
final stockCountCreateDTO = StockCountCreateDTO(); // StockCountCreateDTO | 

try {
    final result = api_instance.createStockCount(stockCountCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling StockCountCreateStockCountApi->createStockCount: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **stockCountCreateDTO** | [**StockCountCreateDTO**](StockCountCreateDTO.md)|  | 

### Return type

[**ApiResponseStockCountDTO**](ApiResponseStockCountDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

