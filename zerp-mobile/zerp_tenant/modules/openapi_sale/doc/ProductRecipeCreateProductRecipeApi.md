# openapi_sale.api.ProductRecipeCreateProductRecipeApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createProductRecipe**](ProductRecipeCreateProductRecipeApi.md#) | **POST** /sale/product-recipes | Create: Create a new entity


# **createProductRecipe**
> ApiResponseProductRecipeDTO createProductRecipe(productRecipeCreateDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = ProductRecipeCreateProductRecipeApi();
final productRecipeCreateDTO = ProductRecipeCreateDTO(); // ProductRecipeCreateDTO | 

try {
    final result = api_instance.createProductRecipe(productRecipeCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling ProductRecipeCreateProductRecipeApi->createProductRecipe: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productRecipeCreateDTO** | [**ProductRecipeCreateDTO**](ProductRecipeCreateDTO.md)|  | 

### Return type

[**ApiResponseProductRecipeDTO**](ApiResponseProductRecipeDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

