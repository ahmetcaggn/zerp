# openapi_employee.model.EmployeeResponseDto

## Load the model package
```dart
import 'package:openapi_employee/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** |  | [optional] 
**username** | **String** |  | [optional] 
**firstName** | **String** |  | [optional] 
**lastName** | **String** |  | [optional] 
**email** | **String** |  | [optional] 
**phoneNumber** | **String** |  | [optional] 
**nationalId** | **String** |  | [optional] 
**dateOfBirth** | [**DateTime**](DateTime.md) |  | [optional] 
**hireDate** | [**DateTime**](DateTime.md) |  | [optional] 
**terminationDate** | [**DateTime**](DateTime.md) |  | [optional] 
**status** | **String** |  | [optional] 
**manager** | [**ManagerDto**](ManagerDto.md) |  | [optional] 
**salary** | **num** |  | [optional] 
**contacts** | [**List<EmployeeContactResponseDto>**](EmployeeContactResponseDto.md) |  | [optional] [default to const []]
**createdAt** | [**DateTime**](DateTime.md) |  | [optional] 
**updatedAt** | [**DateTime**](DateTime.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


