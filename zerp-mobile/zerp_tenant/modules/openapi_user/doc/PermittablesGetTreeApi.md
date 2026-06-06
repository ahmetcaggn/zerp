# openapi_user.api.PermittablesGetTreeApi

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://api.zeerp.tech*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTree**](PermittablesGetTreeApi.md#) | **GET** /user/permittables/tree | 


# **getTree**
> ApiResponsePermittableTreeNodeDTO getTree()



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = PermittablesGetTreeApi();

try {
    final result = api_instance.getTree();
    print(result);
} catch (e) {
    print('Exception when calling PermittablesGetTreeApi->getTree: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResponsePermittableTreeNodeDTO**](ApiResponsePermittableTreeNodeDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

