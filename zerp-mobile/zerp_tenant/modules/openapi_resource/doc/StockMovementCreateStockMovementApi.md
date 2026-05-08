# openapi_resource.api.StockMovementCreateStockMovementApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createStockMovement**](StockMovementCreateStockMovementApi.md#) | **POST** /resource/stock-movements | Create: Create a new entity


# **createStockMovement**
> ApiResponseStockMovementDTO createStockMovement(stockMovementCreateDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockMovementCreateStockMovementApi();
final stockMovementCreateDTO = StockMovementCreateDTO(); // StockMovementCreateDTO | 

try {
    final result = api_instance.createStockMovement(stockMovementCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling StockMovementCreateStockMovementApi->createStockMovement: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **stockMovementCreateDTO** | [**StockMovementCreateDTO**](StockMovementCreateDTO.md)|  | 

### Return type

[**ApiResponseStockMovementDTO**](ApiResponseStockMovementDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

