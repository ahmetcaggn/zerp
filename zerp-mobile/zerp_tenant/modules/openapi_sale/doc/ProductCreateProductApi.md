# openapi_sale.api.ProductCreateProductApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createProduct**](ProductCreateProductApi.md#) | **POST** /sale/products | Create: Create a new entity


# **createProduct**
> ApiResponseProductDTO createProduct(productCreateDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ProductCreateProductApi();
final productCreateDTO = ProductCreateDTO(); // ProductCreateDTO | 

try {
    final result = api_instance.createProduct(productCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling ProductCreateProductApi->createProduct: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productCreateDTO** | [**ProductCreateDTO**](ProductCreateDTO.md)|  | 

### Return type

[**ApiResponseProductDTO**](ApiResponseProductDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

