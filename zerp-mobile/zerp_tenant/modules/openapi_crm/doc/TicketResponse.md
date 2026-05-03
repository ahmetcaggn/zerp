# openapi_crm.model.TicketResponse

## Load the model package
```dart
import 'package:openapi_crm/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** |  | [optional] 
**title** | **String** |  | [optional] 
**description** | **String** |  | [optional] 
**status** | **String** |  | [optional] 
**priority** | **String** |  | [optional] 
**type** | **String** |  | [optional] 
**tenantId** | **String** |  | [optional] 
**reporterId** | **String** |  | [optional] 
**createdAt** | [**DateTime**](DateTime.md) |  | [optional] 
**updatedAt** | [**DateTime**](DateTime.md) |  | [optional] 
**resolvedAt** | [**DateTime**](DateTime.md) |  | [optional] 
**closedAt** | [**DateTime**](DateTime.md) |  | [optional] 
**tags** | **Set<String>** |  | [optional] [default to const {}]
**customAttributes** | [**Map<String, Object>**](Object.md) |  | [optional] [default to const {}]
**watchers** | [**Set<WatcherResponse>**](WatcherResponse.md) |  | [optional] [default to const {}]
**attachments** | [**List<AttachmentResponse>**](AttachmentResponse.md) |  | [optional] [default to const []]
**currentAssignment** | [**TicketAssignmentResponse**](TicketAssignmentResponse.md) |  | [optional] 
**comments** | [**List<CommentResponse>**](CommentResponse.md) |  | [optional] [default to const []]
**slaTracking** | [**SlaTrackingResponse**](SlaTrackingResponse.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


