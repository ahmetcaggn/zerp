## openapi_crm@v0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install openapi_crm@v0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://172.16.29.129:8081*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*TeamsApi* | [**activateTeam**](docs/TeamsApi.md#activateteam) | **POST** /api/teams/{id}/activate | 
*TeamsApi* | [**addTeamMember**](docs/TeamsApi.md#addteammember) | **POST** /api/teams/{id}/members | 
*TeamsApi* | [**changeTeamMemberRole**](docs/TeamsApi.md#changeteammemberrole) | **PATCH** /api/teams/{id}/members/{userId}/role | 
*TeamsApi* | [**createTeam**](docs/TeamsApi.md#createteam) | **POST** /api/teams | Create: Create a new entity
*TeamsApi* | [**deactivateTeam**](docs/TeamsApi.md#deactivateteam) | **POST** /api/teams/{id}/deactivate | 
*TeamsApi* | [**deleteManyTeams**](docs/TeamsApi.md#deletemanyteams) | **DELETE** /api/teams | DeleteMany: Delete multiple entities
*TeamsApi* | [**deleteTeam**](docs/TeamsApi.md#deleteteam) | **DELETE** /api/teams/{id} | Delete: Delete a single entity
*TeamsApi* | [**getList**](docs/TeamsApi.md#getlist) | **GET** /api/teams | GetList: Get paginated list of entities with filtering
*TeamsApi* | [**getManyReference**](docs/TeamsApi.md#getmanyreference) | **GET** /api/teams/of/{target}/{targetId} | GetManyReference: Get entities that reference another entity
*TeamsApi* | [**getManyTeams**](docs/TeamsApi.md#getmanyteams) | **GET** /api/teams/many | GetMany: Get multiple entities by IDs
*TeamsApi* | [**getOneTeam**](docs/TeamsApi.md#getoneteam) | **GET** /api/teams/{id} | GetOne: Get single entity by ID
*TeamsApi* | [**patchMany**](docs/TeamsApi.md#patchmany) | **PATCH** /api/teams | UpdateMany: Update multiple entities
*TeamsApi* | [**patchTeam**](docs/TeamsApi.md#patchteam) | **PATCH** /api/teams/{id} | Update: Update an existing entity
*TeamsApi* | [**removeTeamMember**](docs/TeamsApi.md#removeteammember) | **DELETE** /api/teams/{id}/members/{userId} | 
*TeamsApi* | [**updateTeam**](docs/TeamsApi.md#updateteam) | **PUT** /api/teams/{id} | Update: Update an existing entity
*TicketsApi* | [**addTicketComment**](docs/TicketsApi.md#addticketcomment) | **POST** /api/tickets/{id}/comments | 
*TicketsApi* | [**assignTicket**](docs/TicketsApi.md#assignticket) | **POST** /api/tickets/{id}/assign | 
*TicketsApi* | [**changeTicketPriority**](docs/TicketsApi.md#changeticketpriority) | **PATCH** /api/tickets/{id}/priority | 
*TicketsApi* | [**changeTicketStatus**](docs/TicketsApi.md#changeticketstatus) | **PATCH** /api/tickets/{id}/status | 
*TicketsApi* | [**closeTicket**](docs/TicketsApi.md#closeticket) | **POST** /api/tickets/{id}/close | 
*TicketsApi* | [**createTicket**](docs/TicketsApi.md#createticket) | **POST** /api/tickets | 
*TicketsApi* | [**getTicket**](docs/TicketsApi.md#getticket) | **GET** /api/tickets/{id} | 
*TicketsApi* | [**unassignTicket**](docs/TicketsApi.md#unassignticket) | **DELETE** /api/tickets/{id}/assign | 


### Documentation For Models

 - [AddCommentRequest](docs/AddCommentRequest.md)
 - [AddMemberRequest](docs/AddMemberRequest.md)
 - [ApiResponseListInteger](docs/ApiResponseListInteger.md)
 - [ApiResponseListTeamResponse](docs/ApiResponseListTeamResponse.md)
 - [ApiResponseTeamResponse](docs/ApiResponseTeamResponse.md)
 - [ApiResponseVoid](docs/ApiResponseVoid.md)
 - [AssignTicketRequest](docs/AssignTicketRequest.md)
 - [AttachmentResponse](docs/AttachmentResponse.md)
 - [ChangeMemberRoleRequest](docs/ChangeMemberRoleRequest.md)
 - [ChangePriorityRequest](docs/ChangePriorityRequest.md)
 - [ChangeStatusRequest](docs/ChangeStatusRequest.md)
 - [CommentResponse](docs/CommentResponse.md)
 - [CreateTeamRequest](docs/CreateTeamRequest.md)
 - [CreateTicketRequest](docs/CreateTicketRequest.md)
 - [Meta](docs/Meta.md)
 - [Parameter](docs/Parameter.md)
 - [SlaTrackingResponse](docs/SlaTrackingResponse.md)
 - [TeamMemberResponse](docs/TeamMemberResponse.md)
 - [TeamResponse](docs/TeamResponse.md)
 - [TicketAssignmentResponse](docs/TicketAssignmentResponse.md)
 - [TicketResponse](docs/TicketResponse.md)
 - [UpdateTeamRequest](docs/UpdateTeamRequest.md)
 - [WatcherResponse](docs/WatcherResponse.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

