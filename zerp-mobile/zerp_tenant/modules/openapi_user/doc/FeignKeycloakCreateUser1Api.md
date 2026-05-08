# openapi_user.api.FeignKeycloakCreateUser1Api

## Load the API package
```dart
import 'package:openapi_user/api.dart';
```

All URIs are relative to *https://zerpapi.femrek.dev*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUser1**](FeignKeycloakCreateUser1Api.md#) | **POST** /feign/keycloak/users | 


# **createUser1**
> ApiResponseKeycloakCreateUserResponseDTO createUser1(keycloakCreateUserRequestDTO)



### Example
```dart
import 'package:openapi_user/api.dart';

final api_instance = FeignKeycloakCreateUser1Api();
final keycloakCreateUserRequestDTO = KeycloakCreateUserRequestDTO(); // KeycloakCreateUserRequestDTO | 

try {
    final result = api_instance.createUser1(keycloakCreateUserRequestDTO);
    print(result);
} catch (e) {
    print('Exception when calling FeignKeycloakCreateUser1Api->createUser1: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keycloakCreateUserRequestDTO** | [**KeycloakCreateUserRequestDTO**](KeycloakCreateUserRequestDTO.md)|  | 

### Return type

[**ApiResponseKeycloakCreateUserResponseDTO**](ApiResponseKeycloakCreateUserResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

