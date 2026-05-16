# openapi_sale.api.TableOrderCreateTableOrderApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTableOrder**](TableOrderCreateTableOrderApi.md#) | **POST** /sale/table-orders | Create: Create a new entity


# **createTableOrder**
> ApiResponseTableOrderDTO createTableOrder(tableOrderCreateDTO)

Create: Create a new entity

Creates a new entity with the provided data. Implements ra-spring-data-provider's create operation. Returns the created entity with generated ID and server-side defaults. 

### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = TableOrderCreateTableOrderApi();
final tableOrderCreateDTO = TableOrderCreateDTO(); // TableOrderCreateDTO | 

try {
    final result = api_instance.createTableOrder(tableOrderCreateDTO);
    print(result);
} catch (e) {
    print('Exception when calling TableOrderCreateTableOrderApi->createTableOrder: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tableOrderCreateDTO** | [**TableOrderCreateDTO**](TableOrderCreateDTO.md)|  | 

### Return type

[**ApiResponseTableOrderDTO**](ApiResponseTableOrderDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

