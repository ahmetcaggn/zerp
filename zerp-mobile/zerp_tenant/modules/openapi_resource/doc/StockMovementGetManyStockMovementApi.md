# openapi_resource.api.StockMovementGetManyStockMovementApi

## Load the API package
```dart
import 'package:openapi_resource/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getManyStockMovement**](StockMovementGetManyStockMovementApi.md#) | **GET** /resource/stock-movements/many | GetMany: Get multiple entities by IDs


# **getManyStockMovement**
> ApiResponseListStockMovementDTO getManyStockMovement(id)

GetMany: Get multiple entities by IDs

Retrieves multiple specific entities by their unique identifiers. Implements ra-spring-data-provider's getMany operation.  Unlike getList, this operation does not use pagination. It simply returns all entities with the specified IDs. This is commonly used when the client needs to fetch multiple specific records, such as when displaying relationships or selected items.  If an ID doesn't exist, it is typically omitted from the response rather than returning an error. The order of returned entities may not match the order of requested IDs.  Example: GET /api/posts/many?id=1&id=5&id=12 

### Example
```dart
import 'package:openapi_resource/api.dart';

final api_instance = StockMovementGetManyStockMovementApi();
final id = [[1, 5, 12]]; // List<String> | List of entity IDs to retrieve

try {
    final result = api_instance.getManyStockMovement(id);
    print(result);
} catch (e) {
    print('Exception when calling StockMovementGetManyStockMovementApi->getManyStockMovement: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**List<String>**](String.md)| List of entity IDs to retrieve | [default to const []]

### Return type

[**ApiResponseListStockMovementDTO**](ApiResponseListStockMovementDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

