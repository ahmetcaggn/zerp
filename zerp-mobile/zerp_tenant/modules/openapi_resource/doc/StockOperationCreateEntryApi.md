# openapi_resource.api.StockOperationCreateEntryApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createEntry**](StockOperationCreateEntryApi.md#) | **POST** /resource/stock-operations/entries | 


# **createEntry**
> ApiResponseStockOperationDTO createEntry(stockEntryCreateDTO)



### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockOperationCreateEntryApi();
final stockEntryCreateDTO = StockEntryCreateDTO(); // StockEntryCreateDTO | 

try {
    final result = api_instance.createEntry(stockEntryCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling StockOperationCreateEntryApi->createEntry: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **stockEntryCreateDTO** | [**StockEntryCreateDTO**](StockEntryCreateDTO.md)|  | 

### Return type

[**ApiResponseStockOperationDTO**](ApiResponseStockOperationDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

