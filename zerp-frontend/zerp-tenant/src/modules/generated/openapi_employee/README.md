## openapi_employee@v0

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
npm install openapi_employee@v0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://172.16.29.129:8082*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*EmployeesApi* | [**createEmployee**](docs/EmployeesApi.md#createemployee) | **POST** /employee | Create: Create a new entity
*EmployeesApi* | [**deleteEmployee**](docs/EmployeesApi.md#deleteemployee) | **DELETE** /employee/{id} | Delete: Delete a single entity
*EmployeesApi* | [**deleteManyEmployees**](docs/EmployeesApi.md#deletemanyemployees) | **DELETE** /employee | DeleteMany: Delete multiple entities
*EmployeesApi* | [**getDeletedEmployees**](docs/EmployeesApi.md#getdeletedemployees) | **GET** /employee/deleted | 
*EmployeesApi* | [**getDeletedEmployeesPaginated**](docs/EmployeesApi.md#getdeletedemployeespaginated) | **GET** /employee/deleted/paginated | 
*EmployeesApi* | [**getList**](docs/EmployeesApi.md#getlist) | **GET** /employee | GetList: Get paginated list of entities with filtering
*EmployeesApi* | [**getManyEmployees**](docs/EmployeesApi.md#getmanyemployees) | **GET** /employee/many | GetMany: Get multiple entities by IDs
*EmployeesApi* | [**getManyReference**](docs/EmployeesApi.md#getmanyreference) | **GET** /employee/of/{target}/{targetId} | GetManyReference: Get entities that reference another entity
*EmployeesApi* | [**getOneEmployee**](docs/EmployeesApi.md#getoneemployee) | **GET** /employee/{id} | GetOne: Get single entity by ID
*EmployeesApi* | [**patchEmployee**](docs/EmployeesApi.md#patchemployee) | **PATCH** /employee/{id} | Update: Update an existing entity
*EmployeesApi* | [**patchMany**](docs/EmployeesApi.md#patchmany) | **PATCH** /employee | UpdateMany: Update multiple entities
*EmployeesApi* | [**searchEmployees**](docs/EmployeesApi.md#searchemployees) | **GET** /employee/search | 
*EmployeesApi* | [**updateEmployee**](docs/EmployeesApi.md#updateemployee) | **PUT** /employee/{id} | Update: Update an existing entity


### Documentation For Models

 - [ApiResponseEmployeeResponseDto](docs/ApiResponseEmployeeResponseDto.md)
 - [ApiResponseListEmployeeListResponseDto](docs/ApiResponseListEmployeeListResponseDto.md)
 - [ApiResponseListEmployeeResponseDto](docs/ApiResponseListEmployeeResponseDto.md)
 - [ApiResponseListLong](docs/ApiResponseListLong.md)
 - [ApiResponsePageEmployeeListResponseDto](docs/ApiResponsePageEmployeeListResponseDto.md)
 - [ApiResponseVoid](docs/ApiResponseVoid.md)
 - [CreateEmployeeRequestDto](docs/CreateEmployeeRequestDto.md)
 - [EmployeeContactDto](docs/EmployeeContactDto.md)
 - [EmployeeContactResponseDto](docs/EmployeeContactResponseDto.md)
 - [EmployeeListResponseDto](docs/EmployeeListResponseDto.md)
 - [EmployeeResponseDto](docs/EmployeeResponseDto.md)
 - [ManagerDto](docs/ManagerDto.md)
 - [Meta](docs/Meta.md)
 - [PageEmployeeListResponseDto](docs/PageEmployeeListResponseDto.md)
 - [Pageable](docs/Pageable.md)
 - [PageableObject](docs/PageableObject.md)
 - [Parameter](docs/Parameter.md)
 - [SortObject](docs/SortObject.md)
 - [UpdateEmployeeRequestDto](docs/UpdateEmployeeRequestDto.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

