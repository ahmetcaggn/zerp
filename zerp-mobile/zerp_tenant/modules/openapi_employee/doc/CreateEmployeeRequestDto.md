# openapi_employee.model.CreateEmployeeRequestDto

## Load the model package
```dart
import 'package:openapi_employee/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**username** | **String** |  | 
**tempPassword** | **String** |  | 
**firstName** | **String** |  | 
**lastName** | **String** |  | 
**email** | **String** |  | 
**phoneNumber** | **String** |  | [optional] 
**nationalId** | **String** |  | [optional] 
**dateOfBirth** | [**DateTime**](DateTime.md) |  | [optional] 
**hireDate** | [**DateTime**](DateTime.md) |  | 
**status** | **String** |  | [optional] 
**managerId** | **String** |  | [optional] 
**salary** | **num** |  | [optional] 
**isActive** | **bool** |  | [optional] 
**contacts** | [**List<EmployeeContactDto>**](EmployeeContactDto.md) |  | [optional] [default to const []]
**tenantId** | **String** |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


