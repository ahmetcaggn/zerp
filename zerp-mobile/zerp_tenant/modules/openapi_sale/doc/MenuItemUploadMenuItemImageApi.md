# openapi_sale.api.MenuItemUploadMenuItemImageApi

## Load the API package
```dart
import 'package:openapi_sale/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**uploadMenuItemImage**](MenuItemUploadMenuItemImageApi.md#) | **POST** /sale/menu-items/images | 


# **uploadMenuItemImage**
> MenuItemImageUploadResponseDTO uploadMenuItemImage(categoryId, file)



### Example
```dart
import 'package:openapi_sale/api.dart';

final api_instance = MenuItemUploadMenuItemImageApi();
final categoryId = 38400000-8cf0-11bd-b23e-10b96e4ef00d; // String | 
final file = BINARY_DATA_HERE; // MultipartFileSchema | 

try {
    final result = api_instance.uploadMenuItemImage(categoryId, file);
    print(result);
} catch (e) {
    print('Exception when calling MenuItemUploadMenuItemImageApi->uploadMenuItemImage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **categoryId** | **String**|  | 
 **file** | **MultipartFileSchema**|  | 

### Return type

[**MenuItemImageUploadResponseDTO**](MenuItemImageUploadResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

